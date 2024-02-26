import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm"
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "root",
      database: "typeorm",
      entities: [
        "dist/**/**/*.entity{.ts,.js}"
      ],
      synchronize: true
    }),
    UserModule,
    BlogModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
