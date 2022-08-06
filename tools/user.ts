import { User } from '../src/createUser';

export const validateDataOfUser = (user: User) => {
    const phoneRegex = /^([0-9]{3,4}-[0-9]{4})$/;
    const countryCode = /^\+[0-9]{3}$/;
    const dateRegex = /^\d{4}\-(0[1-9]|1[0-2])\-(0[1-9]|[12][0-9]|3[01])$/;
    const telephone = user.telephone;

    if (!user?.email) {
        return {
            ok: false,
            message: "The email is required"
        }
    }

    if (!user?.password) {
        return {
            ok: false,
            message: "The user's password is required"
        }
    }
    if (!user?.address) {
        return {
            ok: false,
            message: "The address is required"
        }
    }
    if (!user?.username) {
        return {
            ok: false,
            message: "The username is required"
        }
    }
    if (!user?.firstname) {
        return {
            ok: false,
            message: "The firstname is required"
        }
    }
    if (!user?.lastname) {
        return {
            ok: false,
            message: "The lastname is required"
        }
    }
    if (!telephone || typeof (telephone) != 'string') {
        return {
            ok: false,
            message: "The telephone is required"
        }
    }

    const auxTelephone = telephone.split(' ');
    if (
        !(
            (auxTelephone.length === 2 && countryCode.test(auxTelephone[0]) && phoneRegex.test(auxTelephone[1])) ||
            (phoneRegex.test(telephone))
        )
    ) {
        console.log(auxTelephone[0]);
        
        console.log('expression 1: ', auxTelephone.length === 2, countryCode.test(auxTelephone[0]), phoneRegex.test(auxTelephone[1]));
        console.log('expression 2: ', (phoneRegex.test(telephone)));


        return {
            ok: false,
            message: "The telephone is not validate"
        }
    }

    if (!user?.birthday || typeof (user.birthday) != 'string' || !dateRegex.test(user.birthday)) {
        return {
            ok: false,
            message: "The birhday is required"
        }
    }
    if (!user?.userRole) {
        return {
            ok: false,
            message: "The role is required"
        }
    }

    return {
        ok: true,
        user
    }
}
