import { Column, Entity } from "typeorm";
import { BaseEntity } from "./BaseEntity";

enum UserRole {
    ADMIN='admin',
    AUTHOR='author'
}

@Entity({
    orderBy: {
        lastName: 'ASC',
        firstName: 'ASC'
    }
})
export class User extends BaseEntity {
    @Column('varchar', {
        length: 150,
        nullable: false
    })
    firstName: string;

    @Column('varchar', {
        length: 150,
        nullable: false
    })
    lastName: string;

    @Column('varchar', {
        nullable: false,
        unique: true
    })
    email: string;

    @Column('varchar', {
        nullable: false
    })
    passwordHash: string;

    @Column('varchar', {
        nullable: true
    })
    phone: string;

    @Column('enum', {
        nullable: false,
        enum: UserRole
    })
    role: UserRole;
}