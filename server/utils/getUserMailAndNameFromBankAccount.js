const getUserData = async(account) => {
    const user = await account.getUser();
    const userData = {
        name: user.first_name,
        email: user.email
    }
    return userData;
}

module.exports = getUserData;