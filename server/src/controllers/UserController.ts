import { Request, Response, NextFunction } from 'express';
import { hash } from 'bcryptjs';
import { UserRepository } from '../repositories';
import { User } from '../DTOs';

class UserController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      const userRepository = new UserRepository();
      const validatedData = User.parse(userData); // passe o mouse por cima de validatedData no VSCode e veja o tipo!

      const checkNickName = await userRepository.findByNickName(
        validatedData.nickName,
      );

      if (checkNickName) {
        return next({
          status: 400,
          message: 'This NickName is already registered',
        });
      }

      const userWithHashedPassword = await hash(validatedData.password, 6);

      const user = await userRepository.create({
        ...validatedData,
        password: userWithHashedPassword,
      });

      const { password: _, ...userWithoutPassword } = user;

      res.locals = {
        status: 201,
        message: 'User created',
        data: userWithoutPassword,
      };

      return next();
    } catch (error) {
      return next(error);
    }
  }

  async getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userRepository = new UserRepository();

      const followers = await userRepository.findFollowersByUserId(id);

      if (!followers) {
        return next({
          status: 404,
          message: 'Followers not found',
        });
      }

      res.locals = {
        status: 200,
        message: 'Followers found',
        data: followers,
      };

      return next();
    } catch (error) {
      return next(error);
    }
  }

  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userRepository = new UserRepository();

      const posts = await userRepository.findPostsByUserId(id);

      if (!posts?.length) {
        return next({
          status: 204,
          message: 'User has no posts',
        });
      }

      res.locals = {
        status: 200,
        message: 'Posts found',
        data: posts,
      };

      return next();
    } catch (error) {
      return next(error);
    }
  }

  async getPostsByDate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, date_str } = req.params;
      const date = new Date(date_str)
      const userRepository = new UserRepository();

      const posts = await userRepository.findPostsByUserId(id);

      if (!posts?.length) {
        return next({
          status: 204,
          message: 'User has no posts',
        });
      }

      const desired_posts = posts.filter(post => post.date.getTime() === date.getTime())

      if (!desired_posts.length) {
        return next({
          status: 204,
          message: 'No posts found on this date',
          data: date
        });
      }

      res.locals = {
        status: 200,
        message: 'Posts found',
        data: desired_posts,
      };

      return next();
    } catch (error) {
      return next(error);
    }
  }
  
}

export default new UserController();
