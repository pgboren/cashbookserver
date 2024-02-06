import RoleModel from '../models/role.model';
import UserModel from '../models/user.model';

class SystemData {
	
	constructor() {}
  
	initializeData(): void {
	  console.log("Initial User Roles Data");
  
	  const adminRoleData = { name: 'admin' };
	  const managerRoleData = { name: 'user' };
	  
	  RoleModel.estimatedDocumentCount({})
		.then(async (count) => {
		  if (count === 0) {
			await this.createRoles();
		  }
		})
		.catch((err) => {
		  console.error("Error checking role count:", err);
		});
	}
  
	private async createRoles(): Promise<void> {
	  try {
		const adminRole = await RoleModel.create({ name: 'admin' });
		console.log("added 'admin' to roles collection");
  
		await RoleModel.create({ name: 'user' });
		console.log("added 'user' to roles collection");
  
		
		if (adminRole) {
			
		  const adminUserData = {
			username: process.env.USER_ADMIN_NAME,
			email: process.env.USER_ADMIN_EMAIL,
			password: process.env.USER_ADMIN_PASSWORD,
			roles: [adminRole._id],
		  };
  
		  await UserModel.create(adminUserData);
		  console.log("added 'admin' to users collection");
		}
	  } catch (err) {
		console.error("Error adding roles and users:", err);
	  }
	}
  }
  
  export default SystemData;