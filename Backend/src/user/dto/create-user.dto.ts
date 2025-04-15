import { IsEmail, IsString } from "class-validator"

export class CreateUserDto {
    @IsString()
    username: string

    @IsString()
    password: string

    @IsEmail()
    email: string
}

export class UpdatePasswordDto {
    @IsString()
    oldPassword: string

    @IsString()
    newPassword: string
}