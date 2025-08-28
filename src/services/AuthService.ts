export class AuthService {
  static isTokenExpired() {
    const token = localStorage.getItem('token');
    const ttl = localStorage.getItem('ttl');

    if (!token || !ttl) {
      return true;
    }

    if (Date.now() > Number(ttl)) {
      localStorage.removeItem('staffId');
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      localStorage.removeItem('ttl');

      return true;
    }

    return false;
  }

  static getLoggedInStaff() {
    const staffId = localStorage.getItem('staffId');

    if (!staffId) {
      return null;
    }

    return staffId;
  }
}
