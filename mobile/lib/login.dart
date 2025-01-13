import 'dart:convert';
import 'package:area/main.dart';
import 'package:area/user.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:form_field_validator/form_field_validator.dart';
import 'package:http/http.dart' as http;
import 'globals.dart' as globals;

class OAuthButton extends StatelessWidget {
  final Color boxColor;
  final Color textColor;
  final Function onPressed;
  final String serviceName;
  final Image serviceIcon;
  const OAuthButton({
    super.key,
    required this.boxColor,
    required this.textColor,
    required this.onPressed,
    required this.serviceName,
    required this.serviceIcon,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.only(
          top: 5.0,
          left: 10,
          right: 10,
          bottom: 5,
        ),
        child: Container(
          decoration: BoxDecoration(
            border: Border.all(
              width: 0.5,
              color: Colors.grey,
            ),
            borderRadius: BorderRadius.circular(
              50,
            ),
          ),
          width: double.infinity,
          child: ElevatedButton.icon(
            style: ButtonStyle(
              backgroundColor: WidgetStateProperty.all(
                boxColor,
              ),
              padding: WidgetStateProperty.all(const EdgeInsets.all(15)),
            ),
            onPressed: () {
              onPressed();
            },
            label: Text(
              'Sign in with $serviceName',
              style: TextStyle(
                color: textColor,
                fontSize: 18,
              ),
            ),
            icon: serviceIcon,
          ),
        ),
      ),
    );
  }
}

class Auth {
  static Future<int> login(
      String email, String passwd, BuildContext context) async {
    try {
      final server = await globals.storage.read(key: 'server');
      final response = await http.post(
        Uri.parse('http://$server/auth/login'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode({'email': email, 'password': passwd}),
      );

      if (response.statusCode == 200) {
        globals.isLoggedIn = true;
        JsonLoginResponse jsonResponse =
            JsonLoginResponse.fromJson(json.decode(response.body));
        await globals.storage
            .write(key: 'token', value: jsonResponse.data.token);
        await globals.storage
            .write(key: 'email', value: jsonResponse.data.user.email);
        await globals.storage
            .write(key: 'name', value: jsonResponse.data.user.name);
        await globals.storage
            .write(key: 'id', value: jsonResponse.data.user.id);
        globals.navigatorKey.currentState!
            .popUntil(ModalRoute.withName(routeHome));
        globals.navigatorKey.currentState!.pushNamed(routeHome);
      }
      return response.statusCode;
    } catch (error) {
      return 400;
    }
  }

  static Future<bool> register(
      String email, String password, String name, BuildContext context) async {
    try {
      final response = await http.post(
        Uri.parse('${dotenv.env['FLUTTER_PUBLIC_BACKEND_URL']}/users'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'email': email,
          'password': password,
          'username': name,
        }),
      );

      if (response.statusCode == 201) {
        return (await login(email, password, context)) == 200;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final formkey = GlobalKey<FormState>();
  final email = TextEditingController();
  final passwd = TextEditingController();
  bool _passwordObscure = true;

  void setServer(String newAdress) async {
    await globals.storage.write(key: 'server', value: newAdress);
  }

  void _toggle() {
    setState(() {
      _passwordObscure = !_passwordObscure;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 20.0, left: 20, right: 20),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                  color: Colors.white,
                  border: Border.all(color: Colors.grey[300]!),
                ),
                child: Column(
                  children: [
                    const Padding(
                      padding: EdgeInsets.only(top: 20.0),
                      child: Text(
                        'Welcome',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 30,
                        ),
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.only(top: 5.0),
                      child: Text(
                        'Sign in to your account',
                        style: TextStyle(
                          fontSize: 15,
                          color: Colors.grey,
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Form(
                        key: formkey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Email',
                              style: TextStyle(
                                fontWeight: FontWeight.w600,
                                fontSize: 15,
                              ),
                            ),
                            const SizedBox(height: 8),
                            TextFormField(
                              controller: email,
                              validator: MultiValidator([
                                RequiredValidator(
                                    errorText: 'Email is required'),
                                EmailValidator(
                                    errorText: 'Invalid email address'),
                              ]).call,
                              decoration: InputDecoration(
                                hintText: 'Enter your email',
                                prefixIcon: const Icon(Icons.alternate_email),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),
                            const Text(
                              'Password',
                              style: TextStyle(
                                fontWeight: FontWeight.w600,
                                fontSize: 15,
                              ),
                            ),
                            const SizedBox(height: 8),
                            TextFormField(
                              controller: passwd,
                              obscureText: _passwordObscure,
                              validator: RequiredValidator(
                                      errorText: 'Password is required')
                                  .call,
                              decoration: InputDecoration(
                                hintText: 'Enter your password',
                                prefixIcon: const Icon(Icons.lock_outline),
                                suffixIcon: IconButton(
                                  icon: _passwordObscure
                                      ? const Icon(Icons.visibility_off)
                                      : const Icon(Icons.visibility),
                                  onPressed: () {
                                    _toggle();
                                  },
                                ),
                                errorStyle: const TextStyle(fontSize: 18.0),
                                border: const OutlineInputBorder(
                                  borderSide: BorderSide(color: Colors.red),
                                  borderRadius: BorderRadius.all(
                                    Radius.circular(9.0),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),
                            const Text(
                              "Server address",
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 8),
                            SizedBox(
                              width: double.infinity,
                              child: TextFormField(
                                onChanged: setServer,
                                initialValue: '10.0.2.2:8080',
                                textAlign: TextAlign.center,
                                decoration: InputDecoration(
                                  hintText: 'X.X.X.X:XXXX',
                                  hintStyle: const TextStyle(fontSize: 13),
                                  contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 10, vertical: 5),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 20),
                            SizedBox(
                              width: double.infinity,
                              height: 50,
                              child: ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.black,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(32),
                                  ),
                                ),
                                onPressed: () {
                                  if (formkey.currentState!.validate()) {
                                    final response = Auth.login(
                                        email.text, passwd.text, context);
                                    response.then(
                                      (onValue) {
                                        switch (onValue) {
                                          case 200:
                                            break;
                                          case 401:
                                            Fluttertoast.showToast(
                                              msg: "Invalid credentials",
                                              toastLength: Toast.LENGTH_SHORT,
                                              gravity: ToastGravity.BOTTOM,
                                              timeInSecForIosWeb: 1,
                                              textColor: Colors.white,
                                              backgroundColor: Colors.red,
                                              fontSize: 18.0,
                                            );
                                            break;
                                          default:
                                            Fluttertoast.showToast(
                                              msg:
                                                  "Can't connect with the server",
                                              toastLength: Toast.LENGTH_SHORT,
                                              gravity: ToastGravity.BOTTOM,
                                              timeInSecForIosWeb: 1,
                                              textColor: Colors.white,
                                              backgroundColor: Colors.red,
                                              fontSize: 16.0,
                                            );
                                            break;
                                        }
                                      },
                                    );
                                  }
                                },
                                child: const Text(
                                  'Sign In',
                                  style: TextStyle(
                                    fontSize: 18,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ),
                            Column(
                              children: [
                                const SizedBox(height: 16),
                                const Text(
                                  'Or continue with',
                                  style: TextStyle(color: Colors.grey),
                                ),
                                const SizedBox(height: 4),
                                Padding(
                                  padding: const EdgeInsets.symmetric(),
                                  child: OAuthButton(
                                    boxColor: Colors.white,
                                    textColor: Colors.black,
                                    onPressed: () {
                                      globals.navigatorKey.currentState!
                                          .popUntil(ModalRoute.withName(
                                              routeOAuthGoogle));
                                      globals.navigatorKey.currentState!
                                          .pushNamed(routeOAuthGoogle);
                                    },
                                    serviceIcon: Image.asset(
                                      'assets/google.png',
                                      width: 24,
                                      height: 24,
                                    ),
                                    serviceName: 'Google',
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Padding(
                                  padding: const EdgeInsets.symmetric(),
                                  child: OAuthButton(
                                    boxColor: Colors.black,
                                    textColor: Colors.white,
                                    onPressed: () {
                                      globals.navigatorKey.currentState!
                                          .popUntil(ModalRoute.withName(
                                              routeOAuthGithub));
                                      globals.navigatorKey.currentState!
                                          .pushNamed(routeOAuthGithub);
                                    },
                                    serviceIcon: Image.asset(
                                      'assets/github.png',
                                      width: 24,
                                      height: 24,
                                    ),
                                    serviceName: 'Github',
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Padding(
                                  padding: const EdgeInsets.symmetric(),
                                  child: OAuthButton(
                                    boxColor:
                                        const Color.fromARGB(255, 108, 40, 217),
                                    textColor: Colors.white,
                                    onPressed: () {
                                      globals.navigatorKey.currentState!
                                          .popUntil(ModalRoute.withName(
                                              routeOAuthDiscord));
                                      globals.navigatorKey.currentState!
                                          .pushNamed(routeOAuthDiscord);
                                    },
                                    serviceIcon: Image.asset(
                                      'assets/discord.png',
                                      width: 24,
                                      height: 24,
                                    ),
                                    serviceName: 'Discord',
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Don\'t have an account?   ',
                    style: TextStyle(color: Colors.grey),
                  ),
                  GestureDetector(
                    onTap: () {
                      Navigator.pushNamed(context, '/register');
                    },
                    child: const Text(
                      'Create an account',
                      style: TextStyle(
                        color: Colors.black,
                        fontWeight: FontWeight.bold,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
