import { Controller } from '@nestjs/common';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}
}
