// import { AccessControl } from 'accesscontrol';

const grantsObject = {

    superAdmin:{
        profile:{
            'read:own':['*'],
            'update:own':['*', '!id']
        }, 
        
        business:{
            'read:any':['*'],
            'delete:any':['*'],
            'create:any':['*'],
            'update:own':['*'],
            'read:own':['*'],
            'delete:own':['*'],
            
        },
        events:{
            'create:own': ['*'],
            'read:own':['*'],
            'read:any':['*'],
            'delete:own':['*'],
            'update:own':['*'],
            'update:any':['*'],
            'delete:any':['*']
        },
        saveBusiness:{
            'create:own': ['*'],
            'read:own':['*'],
            'delete:own':['*']
        }, 
        saveEvents:{
            'create:own': ['*'],
            'read:own':['*'],
            'delete:own':['*']
        },
        bookTicket:{
            'create:own': ['*'],
            'read:own':['*'],
        },
        users:{
            'create:any':['*'],
            'delete:any':['*'],
            'update:any':['*'],
            'read:any':['*'],
            'create:own':['*']

        },
        counts:{
            'read:any':['*']
        }, 

        sendNotifications:{
            'create:any':['*'],
            'delete:any':['*'],
            'update:any':['*'],
            'read:any':['*'],
            'create:own':['*']
        },
        sendMail:{
            'create:any':['*'],
            'delete:any':['*'],
            'update:any':['*'],
            'read:any':['*'],
            'create:own':['*']
        }

    },

    admin:{
        profile:{
            'read:own':['*'],
            'update:own':['*', '!id']
        }, 
        business:{
            'read:any':['*'],
            'delete:any':['*'],
            'create:any':['*'],
            'update:own':['*'],
            'read:own':['*'],
            'delete:own':['*'],
            
        },

        events:{
            'create:own': ['*'],
            'read:own':['*'],
            'read:any':['*'],
            'delete:own':['*'],
            'update:own':['*'],
            'update:any':['*'],
            'delete:any':['*']
        },
        
        saveBusiness:{
            'create:own': ['*'],
            'read:own':['*'],
            'delete:own':['*']
        }, 
        saveEvents:{
            'create:own': ['*'],
            'read:own':['*'],
            'delete:own':['*']
        },
        bookTicket:{
            'create:own': ['*'],
            'read:own':['*'],
        },
        users:{
            'read:any':['*'],
        },
        sendNotifications:{
            'create:any':['*'],
            'delete:any':['*'],
            'update:any':['*'],
            'read:any':['*'],
            'create:own':['*']
        }, 
        sendMail:{
            'create:any':['*'],
            'read:any':['*'],
            'create:own':['*']
        }

    },


    user: {  
        profile:{
            'read:own':['*'],
            'update:own':['*', '!id']
        },
        events:{
            'create:own': ['*'],
            'read:own':['*'],
            'read:any':['*'],
            'delete:own':['*'],
            'update:own':['*']
        },
        saveBusiness:{
            'create:own': ['*'],
            'read:own':['*'],
            'delete:own':['*']
        }, 
        saveEvents:{
            'create:own': ['*'],
            'read:own':['*'],
            'delete:own':['*']
        },
        bookTicket:{
            'create:own': ['*'],
            'read:own':['*'],
        }
    },



    manager:{
        business:{
            'create:own': ['*'],
            'read:own':['*'],
            'update:own':['*', '!id'],
            'delete:own':['*'],
            'read:any':['*'],
        },

        profile:{
            'read:own':['*'],
            'update:own':['*', '!id']
        }, 
        
        saveBusiness:{
            'create:own': ['*'],
            'read:own':['*'],
            'delete:own':['*']
        }, 

        events:{
            'create:own': ['*'],
            'read:own':['*'],
            'read:any':['*'],
            'delete:own':['*'],
            'update:own':['*']
        },
        saveEvents:{
            'create:own': ['*'],
            'read:own':['*'],
            'delete:own':['*']
        },
        bookTicket:{
            'create:own': ['*'],
            'read:own':['*'],
        }
    }
};

export default grantsObject;


