import {UserEntity} from "src/user/entities/user.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity("blog")
export class BlogEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  title: string;
  @Column()
  text: string;
  @Column()
  userId: number;
  @ManyToOne(() => UserEntity, user => user.blogs, {onDelete: "CASCADE"})
  user: UserEntity;
}
