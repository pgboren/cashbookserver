import RoleModel from '../models/role.model';
import UserModel from '../models/user.model';
import MediaModel from '../models/media.model';
import ColorModel from '../models/color.model';
import { IMedia } from '../models/media.interface';
import { IColor } from '../models/color.interface';
import { IModel } from '../models/model.interface';
import ModelModel from '../models/model.model';
import { Model } from 'mongoose';
import ConditionModel from '../models/condition.model';

class SystemData {
	
	constructor() {}
  
	initializeData(): void {
	  	console.log("Create Color Datas");
	 	this.createColors();

		console.log("Create Model Datas");
	 	this.createModels();

		 console.log("Create Condition Datas");
		this.createConditions();

	  	console.log("Initial User Roles Data");
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

	private async createColor(name: string, code: string): Promise<void> {
		const color : IColor = new ColorModel();
		color.name = name;
		color.code = code;
		color.enable = true;
		color.deleted = false;
		await ColorModel.create(color);
	}

	
	private async createRefDoc(name: string, code: string, refModel:Model<any>): Promise<void> {
		const refDoc = new refModel();
		refDoc.name = name;
		refDoc.code = code;
		refDoc.enable = true;
		refDoc.deleted = false;
		await refModel.create(refDoc);
	}

	private async createConditions(): Promise<void> {
		try {
			ConditionModel.estimatedDocumentCount({}).then(async (count) => {
			if (count === 0) {
				await this.createRefDoc('ថ្មី', 'N', ConditionModel)
				await this.createRefDoc('ក្រដាស់ពន្ធ', 'U', ConditionModel)
				await this.createRefDoc('មួយទឹក', 'S', ConditionModel)
			}
			})
			.catch((err) => {
				console.error("Error checking role count:", err);
			});
		  } catch (err) {
			console.error("Error adding colors.", err);
		  }
		
	} 

	private async createModels(): Promise<void> {
		try {
			ModelModel.estimatedDocumentCount({}).then(async (count) => {
			if (count === 0) {
				await this.createRefDoc("Honda Dream", "HD",ModelModel);
				await this.createRefDoc("Honda Wave", "HW",ModelModel );
				await this.createRefDoc("Honda PCX", "PCX",ModelModel);
				await this.createRefDoc("Honda Scoopy Club", "HSC",ModelModel);
				await this.createRefDoc("Honda Scoopy Club-i", "HSCI",ModelModel);
				await this.createRefDoc("Honda Scoopy Prestige", "HSP",ModelModel);
				await this.createRefDoc("Honda Scoopy Prestige-i", "HSPI",ModelModel);
				await this.createRefDoc("Honda Beat", "HB",ModelModel);
				await this.createRefDoc("Honda ADV", "ADV",ModelModel);
				await this.createRefDoc("Honda Click", "HC",ModelModel);
				await this.createRefDoc("Honda WinnerX", "HW",ModelModel);
				await this.createRefDoc("Suzuki Next", "SN",ModelModel);
			}
			})
			.catch((err) => {
				console.error("Error checking role count:", err);
			});
		  } catch (err) {
			console.error("Error adding colors.", err);
		  }
		
	} 

	private async createColors(): Promise<void> {
		try {
			ColorModel.estimatedDocumentCount({}).then(async (count) => {
			if (count === 0) {
				await this.createColor("ខ្មៅ", "#17202A");
				await this.createColor("ក្រហម", "#A93226");
				await this.createColor("ស", "#ffffff");
				await this.createColor("ខៀវ", "#0051FF");
				await this.createColor("លឿង", "#F1C40F");
			}
			})
			.catch((err) => {
				console.error("Error checking role count:", err);
			});
		  } catch (err) {
			console.error("Error adding colors.", err);
		  }
		
	}
  
	private async createRoles(): Promise<void> {
	  try {
		const adminRole = await RoleModel.create({ name: 'admin' });
		console.log("added 'admin' to roles collection");
  
		const userRole =await RoleModel.create({ name: 'user' });
		console.log("added 'user' to roles collection");

		const userAvatar : IMedia = new MediaModel();
		userAvatar.name = 'default';
		userAvatar.size = 0;
		userAvatar.mimetype = 'jpg';
		userAvatar.path = 'user/default.jpg';
		MediaModel.create(userAvatar);

		if (adminRole) {
		  const adminUserData = {
			username: process.env.USER_ADMIN_NAME,
			email: process.env.USER_ADMIN_EMAIL,
			password: process.env.USER_ADMIN_PASSWORD,
			deletable: false,
			avatar: userAvatar._id,
			roles: [adminRole._id],
		  };
		  await UserModel.create(adminUserData);

		  for (let i = 0; i < 10; i++) {
			const userData = {
			  username: 'user' + i,
			  email: 'user' + i + '@gmail.com',
			  password: '111111111',
			  deletable: true,
			  avatar: userAvatar._id,
			  roles: [userRole._id],
			};
		
			await UserModel.create(userData);
		  }

		  console.log("added 'admin' to users collection");
		}
	  } catch (err) {
		console.error("Error adding roles and users:", err);
	  }
	}
  }
  
  export default SystemData;