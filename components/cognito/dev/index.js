const users = {
    juanToken: {
        UserAttributes: [
            { Name: 'phone', Value: `+56949085251` },
            { Name: 'name', Value: 'Juan' },
            { Name: 'family_name', Value: 'Viera' },
            { Name: 'email', Value: `juanviera89@gmail.com` },
            { Name: 'custom:dni', Value: `26115814-0` },
            { Name: 'custom:mfa', Value: `false` },
            { Name: 'custom:contact', Value: `email` }
        ],
        Username: 'juanviera89'
    },
    sometoken: {
        UserAttributes: [
            { Name: 'name', Value: 'Juan' },
            { Name: 'family_name', Value: 'Viera' },
            { Name: 'email', Value: `juanviera899@gmail.com` },
            { Name: 'custom:dni', Value: `26115814-0` },
            { Name: 'custom:mfa', Value: `false` },
            { Name: 'custom:contact', Value: `email` }
        ],
        Username: 'someuser'
    },
    juanTokenMFA: {
        UserAttributes: [
            { Name: 'phone', Value: `+56949085251` },
            { Name: 'name', Value: 'Juan' },
            { Name: 'family_name', Value: 'Viera' },
            { Name: 'email', Value: `juan_viera22@hotmail.com` },
            { Name: 'custom:dni', Value: `26115814-0` },
            { Name: 'custom:mfa', Value: `true` },
            { Name: 'custom:contact', Value: `email` }
        ],
        Username: 'juan_viera22'
    }
};
const devices = [
    {
        AccessToken: 'sometoken',
        DeviceAttributes: [],
         DeviceCreateDate: Date.now() - 1000 * 60 * 60 * 24 * 365,
         DeviceKey: 'knowndevice002',
         DeviceLastAuthenticatedDate: Date.now(),
         DeviceLastModifiedDate: Date.now(),
         Username: 'someuser'
    },
    {
        AccessToken: 'juanToken',
        DeviceAttributes: [ ],
         DeviceCreateDate: Date.now(),
         DeviceKey: 'unnkowndevice001',
         DeviceLastAuthenticatedDate: Date.now(),
         DeviceLastModifiedDate: Date.now(),
         Username: 'juanviera89'
    },
    {
        AccessToken: 'juanToken',
        DeviceAttributes: [ ],
         DeviceCreateDate: Date.now() - 1000 * 60 * 60 * 24 * 365,
         DeviceKey: 'kowndevice001',
         DeviceLastAuthenticatedDate: Date.now(),
         DeviceLastModifiedDate: Date.now(),
         Username: 'juanviera89'
    },
    {
        AccessToken: 'juanTokenMFA',
        DeviceAttributes: [ ],
         DeviceCreateDate: Date.now(),
         DeviceKey: 'unnkowndevicemfa002',
         DeviceLastAuthenticatedDate: Date.now(),
         DeviceLastModifiedDate: Date.now(),
         Username: 'juan_viera22'
    },
    {
        AccessToken: 'juanTokenMFA',
        DeviceAttributes: [ ],
         DeviceCreateDate: Date.now() - 1000 * 60 * 60 * 24 * 365,
         DeviceKey: 'kowndevicemfa003',
         DeviceLastAuthenticatedDate: Date.now(),
         DeviceLastModifiedDate: Date.now(),
         Username: 'juan_viera22'
    }
]
const rdmProps = {
    names: [
        'Isabella', 'Sofía', 'Camila', 'Agustina', 'Emilia', 'Josefa', 'Isidora', 'Emma', 'Trinidad', 'Florencia', 'Julieta', 'Maite', 'María', 'Amanda', 'Antonella', 'Martina', 'Valentina', 'Catalina', 'Leonor', 'Renata', 'Mia', 'Mateo', 'Agustín', 'Santiago', 'Tomás', 'Benjamín', 'Lucas', 'Gaspar', 'Alonso', 'Vicente', 'Maximiliano', 'Joaquín', 'Matías', 'Martín', 'José', 'Luciano', 'Facundo', 'Julián', 'Gabriel', 'Máximo', 'Juan', 'Camilo'
    ],
    lastname: [
        'Gonzalez', 'Muñoz', 'Rojas', 'Diaz', 'Perez', 'Soto', 'Silva', 'Contreras', 'Lopez', 'Rodriguez', 'Morales', 'Martinez', 'Fuentes', 'Valenzuela', 'Araya', 'Sepulveda', 'Espinoza', 'Torres', 'Castillo', 'Reyes', 'Ramirez', 'Flores', 'Castro', 'Fernandez', 'Alvarez', 'Hernandez', 'Herrera', 'Vargas', 'Gutierrez', 'Gomez', 'Tapia', 'Vergara', 'Carrasco', 'Bravo', 'Sanchez', 'Garcia', 'Vasquez', 'Figueroa', 'Cortes', 'Jara', 'Rivera', 'Miranda', 'Molina', 'Riquelme', 'Vera', 'Olivares', 'Vega', 'Guzman', 'Campos', 'Ortiz'
    ],
    mail: [
        'hotmail', 'gmail', 'outlook', 'yahoo', 'apple', 'amazon', 'azure', 'univ'
    ]
}

const maketoken = (length = 10) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const fakeUser = () => {
    const name = rdmProps.names[Math.floor(Math.random() * rdmProps.names.length)]
    const family_name = rdmProps.lastname[Math.floor(Math.random() * rdmProps.lastname.length)]
    const user = {
        UserAttributes: [
            { Name: 'phone', Value: `+${(99999999999 - Math.random() * 9999999999).toString().split('.')[0]}` },
            { Name: 'name', Value: name },
            { Name: 'family_name', Value: family_name },
            { Name: 'email', Value: `${name}.${family_name}@${rdmProps.mail[Math.floor(Math.random() * rdmProps.mail.length)]}.com` },
            { Name: 'custom:dni', Value: `${(30000000 - Math.random() * 9999999).toString().split('.')[0]}` },
            { Name: 'custom:mfa', Value: `false` },
            { Name: 'custom:contact', Value: `email` }
        ]
    }
    user.Username = `${name}.${family_name}`.toLowerCase();
    return user
}

const cognito = {
    getUser: (options, cb) => {
        const { AccessToken } = options;
        if (AccessToken == undefined) return cb ? callback(new Error('Bad token')) : {
            promise: () => new Promise((resolve, reject) => {
                reject(new Error('Bad token'))
            })
        }
        if (AccessToken == 'UserNotAuthenticated2020') {
            return cb ? callback(new Error('Bad user')) : {
                promise: () => new Promise((resolve, reject) => {
                    reject(new Error('Bad user'))
                })
            }
        }
        let user
        if (users[AccessToken]) {
            user = users[AccessToken]
        } else {
            user = fakeUser()
            users[AccessToken] = user
        }
        return cb ? cb(undefined, user) : {
            promise: () => new Promise((resolve, reject) => resolve(user))
        }
    },
    listUsers: (params, cb) => {
        const { Filter } = params;
        if (!Filter) {
            return cb ? callback(new Error('Bad filter')) : {
                promise: () => new Promise((resolve, reject) => {
                    reject(new Error('Bad filter'))
                })
            }
        }
        const [key, value] = Filter.split('=').map(el => el.trim())
        const _Users = Object.keys(users).filter(token => {
            return users[token].UserAttributes.findIndex(attr => attr.Name == key && attr.Value == value.replace(/\"/g, '')) >= 0
        });
        return cb ? cb(undefined, { Users: _Users.map( token => users[token]) }) : {
            promise: () => new Promise((resolve, reject) => resolve({ Users: _Users.map( token => users[token]) }))
        }
    },
    adminCreateUser : (params, cb) => {
        const {Username, UserAttributes} = params;
        if(!Username || !UserAttributes) {
            return cb ? callback(new Error('Bad user')) : {
                promise: () => new Promise((resolve, reject) => {
                    reject(new Error('Bad user'))
                })
            }
        }
        const token = maketoken();
        users[token] = {
            Username, 
            UserAttributes
        }
        console.log('==================adminCreateUser==================');
        console.log(token, {Username, UserAttributes});
        console.log('====================================');
        return cb ? cb(undefined, {Username, UserAttributes}) : {
            promise: () => new Promise((resolve, reject) => resolve({Username, UserAttributes}))
        }
    },
    adminSetUserPassword : (params, cb) => {
        const { Username, Password}  = params;
        if(!Username || !Password) {
            return cb ? callback(new Error('Bad user')) : {
                promise: () => new Promise((resolve, reject) => {
                    reject(new Error('Bad user'))
                })
            }
        }
        user = fakeUser();
        return cb ? cb(undefined, {...user}) : {
            promise: () => new Promise((resolve, reject) => resolve({...user}))
        }
    },
    adminUpdateUserAttributes : (params, cb) => {
        const { Username, UserAttributes}  = params;
        if(!Username || !UserAttributes) {
            return cb ? callback(new Error('Bad attr')) : {
                promise: () => new Promise((resolve, reject) => {
                    reject(new Error('Bad attr'))
                })
            }
        };
        return cb ? cb(undefined, {Username, UserAttributes}) : {
            promise: () => new Promise((resolve, reject) => resolve({Username, UserAttributes}))
        }
    },
    getDevice : (params, cb) => { 
        const { AccessToken, DeviceKey }  = params;
        if(!AccessToken) {
            return cb ? callback(new Error('Bad token')) : {
                promise: () => new Promise((resolve, reject) => {
                    reject(new Error('Bad token'))
                })
            }
        };
        const devs = devices.filter( d => d.AccessToken == AccessToken && d.DeviceKey == DeviceKey)[0];
        
        return cb ? cb(undefined, {Username, UserAttributes}) : {
            promise: () => new Promise((resolve, reject) => resolve({... devs}))
        }
    },
    AdminListDevices :  (params, cb) => { 
        const { Username, UserPoolId}  = params;
        if(!Username || UserPoolId) {
            return cb ? callback(new Error('Bad token')) : {
                promise: () => new Promise((resolve, reject) => {
                    reject(new Error('Bad token'))
                })
            }
        };
        const devs = devices.filter( d => d.Username == Username);
        return cb ? cb(undefined, {Username, UserAttributes}) : {
            promise: () => new Promise((resolve, reject) => resolve({Devices : devs}))
        }
    }
};


module.exports = {
    maketoken,
    cognito,
    fakeUser
}