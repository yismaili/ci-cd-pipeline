import { Test, TestingModule } from '@nestjs/testing';
import { UserPostsGateway } from './user-posts.gateway';
import { UserPostsService } from './user-posts.service';

describe('UserPostsGateway', () => {
  let gateway: UserPostsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPostsGateway, UserPostsService],
    }).compile();

    gateway = module.get<UserPostsGateway>(UserPostsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
