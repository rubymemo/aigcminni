export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  // 需求里该有的
  userId?: string;
  userName?: string;
  avatar?: string;
  nickname?: string;
  roles?: RoleType;

  // 需求没有的
  name?: string;
  job?: string;
  organization?: string;
  location?: string;
  email?: string;
  introduction?: string;
  personalWebsite?: string;
  jobName?: string;
  organizationName?: string;
  locationName?: string;
  phone?: string;
  registrationDate?: string;
  accountId?: string;
  certification?: number;
  role: RoleType;
}
