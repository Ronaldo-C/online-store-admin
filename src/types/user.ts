export interface UserData {
  id: string
  name: string
  username: string
  password: string
  email: string | null
  status: UserStatus
  userRole: UserRole
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  operatedBy: string
}

export enum UserRole {
  superAdmin = 'superAdmin',
  admin = 'admin',
}

export const UserRoleOptions = [
  { label: '超级管理员', value: UserRole.superAdmin },
  { label: '管理员', value: UserRole.admin },
]

export enum UserStatus {
  active = 'active',
  unusual = 'unusual',
  locked = 'locked',
  deleted = 'deleted',
}

export interface UpdateUserSelfRequest {
  username: string
  email: string
}
