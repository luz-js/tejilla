import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../entities/User';
import { CreateUserDto, UpdateUserDto } from '../dtos/user';
import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { HttpException } from '../middlewares/errorHandler'; // Assuming a HttpException class for error handling

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, role } = createUserDto;

    const existingUserByEmail = await this.userRepository.findOneBy({ email });
    if (existingUserByEmail) {
      throw new HttpException(409, 'El correo electrónico ya está registrado.');
    }

    const existingUserByUsername = await this.userRepository.findOneBy({ username });
    if (existingUserByUsername) {
      throw new HttpException(409, 'El nombre de usuario ya está en uso.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      username,
      email,
      password_hash: hashedPassword,
      role: role || UserRole.LECTOR, // Default role if not provided
    });

    return this.userRepository.save(newUser);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt'], // Explicitly select fields to exclude password_hash
    });
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(404, 'Usuario no encontrado.');
    }
    // Consider selecting specific fields if password_hash should not be returned even if present
    // For example: return this.userRepository.findOne({ where: { id }, select: [...] });
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(404, 'Usuario no encontrado para actualizar.');
    }

    // Check for username/email conflicts if they are being changed
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUserByEmail = await this.userRepository.findOneBy({ email: updateUserDto.email });
      if (existingUserByEmail && existingUserByEmail.id !== id) {
        throw new HttpException(409, 'El nuevo correo electrónico ya está registrado por otro usuario.');
      }
    }
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUserByUsername = await this.userRepository.findOneBy({ username: updateUserDto.username });
      if (existingUserByUsername && existingUserByUsername.id !== id) {
        throw new HttpException(409, 'El nuevo nombre de usuario ya está en uso por otro usuario.');
      }
    }

    let newPasswordHash: string | undefined;
    if (updateUserDto.password) {
      newPasswordHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Update user properties
    // Note: Using Object.assign can be risky if DTO contains properties not in entity.
    // Prefer explicit assignment or repository.preload/merge.
    // user.username = updateUserDto.username || user.username; // this is not ideal
    // user.email = updateUserDto.email || user.email;
    // user.role = updateUserDto.role || user.role;
    // if (newPasswordHash) {
    //   user.password_hash = newPasswordHash;
    // }
    // await this.userRepository.save(user);

    // A more robust way to update:
    const updatePayload: Partial<User> = { ...updateUserDto };
    if (newPasswordHash) {
      updatePayload.password_hash = newPasswordHash;
      delete updatePayload.password; // Remove plain password from payload
    } else {
      delete updatePayload.password; // Ensure plain password is not accidentally saved
    }

    // TypeORM's update method doesn't run subscribers or listeners, and doesn't return the full entity by default.
    // For returning the updated entity and running hooks, find and save is better.
    await this.userRepository.update(id, updatePayload);

    // Re-fetch the user to get the updated version, as .update doesn't return the entity with all relations.
    // Or use save as shown above if you load the entity first.
    const updatedUser = await this.userRepository.findOneBy({ id });
    if (!updatedUser) {
        throw new HttpException(500, 'Error al actualizar el usuario, no se pudo encontrar después de la actualización.');
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(404, 'Usuario no encontrado para eliminar.');
    }
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      // This case should ideally be caught by the findOneBy check, but good for safety.
      throw new HttpException(404, 'Usuario no encontrado, no se pudo eliminar.');
    }
  }

  // Helper to strip password hash from user object if needed (e.g., before sending as response)
  // This is better handled by SELECT clauses in queries or by class-transformer's @Exclude decorator in the entity.
  // public omitPasswordHash(user: User): Omit<User, 'password_hash'> {
  //   const { password_hash, ...userWithoutPassword } = user;
  //   return userWithoutPassword;
  // }
}
