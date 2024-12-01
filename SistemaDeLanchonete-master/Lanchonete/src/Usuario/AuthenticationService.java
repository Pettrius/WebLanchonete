package Usuario;

public class AuthenticationService {

    private UserAccountManager accountManager;

    public AuthenticationService(UserAccountManager accountManager) {
        this.accountManager = accountManager;
    }

    public boolean login(String username, String password) {
        return accountManager.isValidAccount(username, password);
    }
}