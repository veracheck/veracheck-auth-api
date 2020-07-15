import { User } from './user.interface';

export interface Errors {
    login?: any;
    logout?: any;
    register?: any;
    passwordRecovery?: any;
    passwordReset?: any;
}

export interface State {
    online: boolean;
    token?: string | null;
    user?: User | null;
    error?: Errors | null;
    passwordRecovery?: boolean;
    passwordReset?: boolean;
}