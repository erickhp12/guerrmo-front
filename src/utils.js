const getProfile = () => {
    let profile = {
        price: 1,
        client_id: 0,
    }
    try {
        const perfil = JSON.parse(localStorage.getItem('profile'))
        if (!perfil) {
            profile.price = 1;
            profile.client_id = 0
            return profile;
        }
        return perfil;
    } catch(error) {
        profile.price = 1
        profile.client_id = 0
        return profile
    }
}

module.exports = {
    getProfile
}