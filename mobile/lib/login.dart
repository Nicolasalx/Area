import 'dart:convert';
import 'package:area/main.dart';
import 'package:area/user.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter/material.dart';
import 'package:form_field_validator/form_field_validator.dart';
import 'package:http/http.dart' as http;
import 'globals.dart' as globals;

class Auth {
  static Future<bool> login(
      String email, String passwd, BuildContext context) async {
    try {
      final response = await http.post(
        Uri.parse('${dotenv.env['FLUTTER_PUBLIC_BACKEND_URL']}/auth/login'),
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

  String emailValue = "";
  String passwordValue = "";
  final formkey = GlobalKey<FormState>();
  final email = TextEditingController();
  final passwd = TextEditingController();

  void _toggle() {
    setState(() {
      _passwordObscure = !_passwordObscure;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.only(top: 100.0, left: 20, right: 20),
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
                              RequiredValidator(errorText: 'Email is required'),
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
                                  print(email.text);
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
                                    const EdgeInsets.all(20),
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
                                      color: Colors.white, fontSize: 22),
                                ),
                              ),
                            ),
                          ),
                        ),
                        const Center(
                          child: Padding(
                            padding: EdgeInsets.only(top: 20.0),
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
                        Center(
                          child: Padding(
                            padding: const EdgeInsets.only(
                                top: 20.0, left: 10, right: 10, bottom: 20),
                            child: Container(
                              decoration: BoxDecoration(
                                border: Border.all(
                                  width: 1,
                                  color:
                                      const Color.fromARGB(255, 119, 119, 119),
                                ),
                                borderRadius: BorderRadius.circular(50),
                              ),
                              width: double.infinity,
                              child: ElevatedButton.icon(
                                label: const Text(
                                  'Sign in with Google',
                                  style: TextStyle(
                                      color: Colors.black, fontSize: 22),
                                ),
                                icon: Image.asset(
                                  'assets/google.png',
                                  width: 40,
                                  height: 40,
                                ),
                                style: ButtonStyle(
                                  backgroundColor:
                                      WidgetStateProperty.all(Colors.white),
                                  padding: WidgetStateProperty.all(
                                      const EdgeInsets.all(20)),
                                  textStyle: WidgetStateProperty.all(
                                    const TextStyle(
                                        fontSize: 14, color: Colors.white),
                                  ),
                                ),
                                onPressed: () {
                                  print('form submited');
                                },
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
