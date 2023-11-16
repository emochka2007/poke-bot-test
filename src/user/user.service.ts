import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { UserCreateDto } from './dto/user-create.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: UserCreateDto): Promise<User> {
    const { username } = user;
    console.log(user);
    const existingUser = await this.userModel

      .findOne({ username: username })
      .exec();
    if (existingUser) {
      console.log(existingUser);
    }
    const createdUser = new this.userModel({
      ...user,
    });
    return await createdUser.save();
  }

  async findByUsername(username: string): Promise<UserDocument> {
    return await this.userModel.findOne({ username }).exec();
  }

  async updateRating(username: string, win: boolean): Promise<void> {
    const update = win ? { $inc: { rating: 1 } } : { $inc: { rating: -1 } };

    await this.userModel.findOneAndUpdate({ username: username }, update, {
      new: true,
    });
  }
}
