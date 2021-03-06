import {
  Controller,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseFilters,
  NotFoundException,
  Param,
  UseGuards,
  Delete,
  HttpCode,
} from '@nestjs/common'
import { PAGE_SIZE } from '~/constants/pagination'
import { Pagination } from '~/types/pagination'
import { HttpExceptionFilter } from '~/filters/http-exception.filter'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Comment } from './comment.entity'
import { CommentService } from './comment.service'

@Controller('admin/comments')
export class AdminController {
  constructor(private commentService: CommentService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,
    @Query('page_size', new DefaultValuePipe(PAGE_SIZE), ParseIntPipe)
    page_size: number,
  ): Promise<Pagination<Comment>> {
    return this.commentService.findAll({ page, page_size })
  }

  @Get(':article_id')
  findByArticleId(
    @Param('article_id') id: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,
    @Query('page_size', new DefaultValuePipe(PAGE_SIZE), ParseIntPipe)
    page_size: number,
  ): Promise<Pagination<Comment>> {
    return this.commentService.findByArticleId(id, { page, page_size })
  }

  @Get(':id')
  @UseFilters(HttpExceptionFilter)
  async findById(@Param('id') id: number): Promise<Comment> {
    const comment = await this.commentService.findById(id)
    if (comment) {
      return comment
    }

    throw new NotFoundException()
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @UseFilters(HttpExceptionFilter)
  async remove(@Param('id') id: number): Promise<string> {
    const res = await this.commentService.remove(id)

    if (!res) {
      throw new NotFoundException()
    }

    return ''
  }
}
