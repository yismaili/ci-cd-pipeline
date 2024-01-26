import { Test, TestingModule } from '@nestjs/testing';
import { UserPostsService } from './user-posts.service';

describe('UserPostsService', () => {
  let service: UserPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPostsService],
    }).compile();

    service = module.get<UserPostsService>(UserPostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
