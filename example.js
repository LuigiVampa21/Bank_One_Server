// Third arguments in model = paranoid: true
// set a timer to delete {force: true} after a month!
// if deleteAt !== null it means the user wasn't deleted if it has a time it means it was delete but still in the DB
// Sequelize will automatically ignore all the soft deleted users tho, except with the raw queries or with User.findOne({paranoid: false})
// find ALl excludes['password']
// Increment decrement model.property
// Sequelize.fn 'SUM', 'AVG', 'COUNT', sequelize.col('transfer')
// findAll limit
// findAll order [['age', 'DESC' ]]
// findAll op.gt > 0
// User.destroy({truncate: true}) => DELETE EVERY ROW IN A TABLE
// User.max('age') => Return max age in a table
// User.sum('age')
// User.findOrCreate
// findAndCountAll: response ===> const  {count, rows} = response;
// compress long attributes =
// description : {
// type:DataString.STRING,
// set(value){
//const comrpessed = zlib.deflateSync(value).toString('base64')
// this.setDataValue('description', compressed)
// }
//get(){
// const value = this.getDataValue('description');
//const uncompressed = zlib.inflateSync(Buffer.from(value, 'base64'))
// return uncompressed;
// }
// }

// age: {
// type: DataTypes.INTEGER,
// validate: {
// isOldEnough(value){
//if(value < 18){
//throw new Error('Too young')
//}
//}
//}
//}

// validate:{
// isIn: {
// args: ['failed', 'pending', 'fuflfilled'];
// msg: 'A tx is either failed or fulfilled!';
// }
// }

// validate:{
// isNumeric :{
//    msg: 'You must enter a number here!'
// }
// }

// MODEL WIDE VALIDATION : THIRD ARGUMENT OF THE MODEL
// validate: {
// usernamePAssMatch(){
// if(this.username === this password){
// throw new Error('Password cannot be your username)
// }
// }
// }
// }

// confirmPasswordMatch

// Password stored as virtual to not store the password wihtout hash into the DB instead we store the virtual only if both passwords matchs
// password: {
//   type:DataTypes.VIRTUAL,
//   allowNull: false,
//   validate: {
//     notNull: {
//       msg:'A password is required'
//     },
//     notEmpty: {
//       msg: 'Please provide a password'
//     },
//     len: {
//       args: [8,20],
//       msg: 'The password should be...'
//     }
//   }
// }

// confirmedPassword: {
//   type:DataTypes.STRING,
//   allowNull: false,
//   set(val){
//    if(val === this.password){
//      const hashedPassword = bcrypt.hashSync(val,10);
//      this.setDataValue('confirmedPassword', hashedPassword)
// }
// },
// validate: {
//  notNull: {
// msg: 'Both passwords must match'
// }
// }
// }
// }

// ------------------------------------------------------------ ASSOCIATIONS

// --------------------------------------------------------------- ONE TO ONE

// Country and capital

const Country = sequelize.define(
    "country",
    {
      countryName: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      timestamps: false,
    }
  );
  const Capital = sequelize.define(
    "capital",
    {
      capitalName: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      timestamps: false,
    }
  );
  
  // Country = parent Table
  Country.hasOne(Capital, {
    foreignKey: {
      name: "country_id",
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  // on delete cascade remove botch column when one is deleted
  // on update cascade will update the foreignKey if ever the primary key of the parent is modified
  
  let country, capital;
  // SET
  country.setCapital(capital);
  // GET
  country.getCapital();
  // CREATE
  country.createCapital({
    capitalName: "Paris",
  });
  
  // Capital = child table
  Capital.belongsTo(Country, {
    foreignKey: {
      name: "country_id",
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    onDelete: "CASCADE",
  });
  
  // let capital, country;
  // SET
  Capital.setCountry(country);
  // GET
  Capital.getCountry();
  // CREATE
  Capital.createCountry({
    countryName: "Paris",
  });
  
  // await sequelize.sync({alter: true}).then(() => console.lgo('DB sync')).catch((err) => console.error(err))
  
  // --------------------------------------------------------------- ONE TO MANY
  // SEVERAL OCCURANCES OF ONE FOREIGN KEY INTO CHILD TABLE
  
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );
  const Post = sequelize.define(
    "post",
    {
      message: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      timestamps: false,
    }
  );
  
  User.hasMany(Post, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Post.belongsTo(User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  
  let user, post;
  
  user.addPost(post);
  // This will add the pk of this user as the foreign key in this post
  
  user.countPosts();
  // this will return the number of posts that have the PK of this user as a FK
  
  user.removePost(post);
  // this will remove the FK on this post, but wont remove the post
  
  // with the onDelete cascade if a user is removes, this will automatically remove all the post that have is PK as a FK
  
  // We still can use set get and create on the One to Many relationship
  
  // --------------------------------------------------------------- MANY TO MANY
  // JOIN TABLE
  
  const Customer = sequelize.define(
    "customer",
    {
      customerName: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      timestamps: false,
    }
  );
  const Product = sequelize.define(
    "product",
    {
      productName: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      timestamps: false,
    }
  );
  
  Customer.belongsToMany(Product, {
    through: "customer_product",
  });
  Product.belongsToMany(Customer, {
    through: "customer_product",
  });
  
  // It is also possible to create the table if we want to add it a specific ID in this case the throught will be followed by the variableName of that table and not a string
  
  let customer, product;
  
  customer.addProducts(product);
  // Create row with PK of customer and the PK of that particular product
  
  product.addCustomers(customer);
  // Create row with PK of product and the id of that particular customer
  
  // DEFAULT for onDelete and onUpdate automatically on CASCADE for m to m association
  