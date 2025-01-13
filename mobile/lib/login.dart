import 'dart:convert';
import 'package:area/main.dart';
import 'package:area/user.dart';
import 'package:flutter/material.dart';
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
              color: const Color.fromARGB(
                255,
                119,
                119,
                119,
              ),
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
              color: const Color.fromARGB(
                255,
                119,
                119,
                119,
              ),
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
  static Future<bool> login(
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
      return true;
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
  bool _passwordObscure = true;

  final formkey = GlobalKey<FormState>();
  final email = TextEditingController();
  final passwd = TextEditingController();

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
              padding: const EdgeInsets.only(top: 25.0, left: 20, right: 20),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                  color: const Color.fromARGB(255, 255, 255, 255),
                  border: Border.all(
                    color: const Color.fromARGB(255, 185, 185, 185),
                  ),
                ),
                child: Column(
                  children: <Widget>[
                    const Padding(
                      padding: EdgeInsets.only(top: 30.0),
                      child: Center(
                        child: Text(
                          'Welcome',
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            fontSize: 30,
                          ),
                        ),
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.only(top: 5.0),
                      child: Center(
                        child: Text(
                          'Sign in to your account',
                          style: TextStyle(
                            fontSize: 15,
                            color: Color.fromARGB(255, 119, 119, 119),
                          ),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: Form(
                        key: formkey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            const Padding(
                              padding: EdgeInsets.only(left: 15),
                              child: Text(
                                'Email',
                                style: TextStyle(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 15,
                                ),
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: TextFormField(
                                controller: email,
                                validator: MultiValidator([
                                  RequiredValidator(
                                      errorText: 'Email is required'),
                                  EmailValidator(
                                      errorText: 'Invalid email address'),
                                ]).call,
                                decoration: const InputDecoration(
                                  hintText: 'Enter your email',
                                  prefixIcon: Icon(
                                    Icons.alternate_email,
                                    color: Color.fromARGB(255, 119, 119, 119),
                                  ),
                                  errorStyle: TextStyle(fontSize: 18.0),
                                  border: OutlineInputBorder(
                                    borderSide: BorderSide(color: Colors.red),
                                    borderRadius: BorderRadius.all(
                                      Radius.circular(9.0),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            const Padding(
                              padding: EdgeInsets.only(left: 15),
                              child: Text(
                                'Password',
                                style: TextStyle(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 15,
                                ),
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: TextFormField(
                                controller: passwd,
                                decoration: InputDecoration(
                                  hintText: 'Enter your password',
                                  prefixIcon: const Icon(
                                    Icons.lock,
                                    color: Color.fromARGB(255, 119, 119, 119),
                                  ),
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
                                obscureText: _passwordObscure,
                              ),
                            ),
                            Center(
                              child: Padding(
                                padding: const EdgeInsets.only(
                                    top: 10.0, left: 10, right: 10),
                                child: SizedBox(
                                  width: double.infinity,
                                  child: ElevatedButton(
                                    style: ButtonStyle(
                                      backgroundColor:
                                          WidgetStateProperty.all(Colors.green),
                                      padding: WidgetStateProperty.all(
                                        const EdgeInsets.all(15),
                                      ),
                                      textStyle: WidgetStateProperty.all(
                                        const TextStyle(
                                            fontSize: 14, color: Colors.white),
                                      ),
                                    ),
                                    onPressed: () {
                                      if (formkey.currentState!.validate()) {
                                        Auth.login(
                                            email.text, passwd.text, context);
                                      }
                                    },
                                    child: const Text(
                                      'Sign in',
                                      style: TextStyle(
                                          color: Colors.white, fontSize: 18),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            const Center(
                              child: Padding(
                                padding: EdgeInsets.only(top: 15.0),
                                child: Center(
                                  child: Text(
                                    'Or continue with',
                                    style: TextStyle(
                                      fontSize: 15,
                                      color: Color.fromARGB(255, 119, 119, 119),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.only(top: 5),
                              child: OAuthButton(
                                boxColor: Colors.white,
                                textColor: Colors.black,
                                onPressed: () {
                                  globals.navigatorKey.currentState!.popUntil(
                                      ModalRoute.withName(routeOAuthGoogle));
                                  globals.navigatorKey.currentState!
                                      .pushNamed(routeOAuthGoogle);
                                },
                                serviceIcon: Image.asset(
                                  'assets/google.png',
                                  width: 30,
                                  height: 30,
                                  width: 30,
                                  height: 30,
                                ),
                                serviceName: 'Google',
                              ),
                            ),
                            OAuthButton(
                              boxColor: Colors.black,
                              textColor: Colors.white,
                              onPressed: () {
                                globals.navigatorKey.currentState!.popUntil(
                                    ModalRoute.withName(routeOAuthGithub));
                                globals.navigatorKey.currentState!
                                    .pushNamed(routeOAuthGithub);
                              },
                              serviceIcon: Image.asset(
                                'assets/github.png',
                                width: 30,
                                height: 30,
                              ),
                              serviceName: 'Github',
                            ),
                            OAuthButton(
                              boxColor: const Color.fromARGB(255, 108, 40, 217),
                              textColor: Colors.white,
                              onPressed: () {
                                globals.navigatorKey.currentState!.popUntil(
                                    ModalRoute.withName(routeOAuthDiscord));
                                globals.navigatorKey.currentState!
                                    .pushNamed(routeOAuthDiscord);
                              },
                              serviceIcon: Image.asset(
                                'assets/discord.png',
                                width: 30,
                                height: 30,
                              ),
                              serviceName: 'Discord',
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
              padding: EdgeInsets.only(
                top: 15,
                left: 10,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: EdgeInsets.only(
                          top: 2,
                        ),
                        child: Text(
                          "Server adress: ",
                          style: TextStyle(
                            fontSize: 15,
                            color: Color.fromARGB(255, 119, 119, 119),
                          ),
                        ),
                      ),
                      Flexible(
                        flex: 1,
                        child: Padding(
                          padding: EdgeInsets.only(right: 90),
                          child: SizedBox(
                            height: 30,
                            child: TextFormField(
                              onChanged: (String newAdress) {
                                setServer(newAdress);
                              },
                              initialValue: '10.0.2.2:8080',
                              decoration: const InputDecoration(
                                hintText: 'X.X.X.X:XXXX',
                                hintStyle: TextStyle(
                                  fontSize: 13,
                                ),
                                errorStyle: TextStyle(
                                  fontSize: 13.0,
                                ),
                                border: OutlineInputBorder(
                                  borderSide: BorderSide(
                                    color: Colors.red,
                                  ),
                                  borderRadius: BorderRadius.all(
                                    Radius.circular(
                                      9.0,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
          //   )
          // ],
        ),
      ),
    );
  }
}
