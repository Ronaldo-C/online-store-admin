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

export enum UserStatus {
  active = 'active',
  unusual = 'unusual',
  locked = 'locked',
  deleted = 'deleted',
}
