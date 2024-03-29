import {
	Body,
	Controller,
	Delete,
	Get, HttpException, HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	UploadedFile, UploadedFiles,
	UseInterceptors, ValidationPipe
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { TransformInterceptor } from '../transform.interceptor';
import { ProfileDto } from './dto/profile.dto';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';


@ApiTags('Profiles')
@UseInterceptors(TransformInterceptor)
@Controller('profiles')
export class ProfilesController {
	constructor(private readonly profilesService: ProfilesService) {
	}

	@Post()
	@UseInterceptors(AnyFilesInterceptor())
	async create(@UploadedFiles() files: Express.Multer.File[], @Body() body: { profile: string }): Promise<ProfileDto> {
		if (!files.length) throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);

		const profile: CreateProfileDto = JSON.parse(body?.profile);

		return this.profilesService.create(profile, files);
	}

	@Get()
	findAll(): Promise<ProfileDto[]> {
		return this.profilesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string): Promise<ProfileDto> {
		return this.profilesService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto): Promise<ProfileDto> {
		return this.profilesService.update(id, updateProfileDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string): Promise<boolean> {
		return this.profilesService.remove(id);
	}
}
