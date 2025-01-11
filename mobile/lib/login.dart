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
        return login(email, password, context);
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
              color: Colors.white,
              border: Border.all(color: Colors.grey[300]!),
            ),
            child: Column(
              children: [
                const Padding(
                  padding: EdgeInsets.only(top: 30.0),
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
                  padding: const EdgeInsets.all(20.0),
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
                            RequiredValidator(errorText: 'Email is required'),
                            EmailValidator(errorText: 'Invalid email address'),
                          ]).call,
                          decoration: InputDecoration(
                            hintText: 'Enter your email',
                            prefixIcon: const Icon(Icons.alternate_email),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),
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
                              icon: Icon(_passwordObscure
                                  ? Icons.visibility_off
                                  : Icons.visibility),
                              onPressed: _toggle,
                            ),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        ),
                        const SizedBox(height: 30),
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
                                Auth.login(
                                  email.text,
                                  passwd.text,
                                  context,
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
                        const SizedBox(height: 20),
                        const Center(
                          child: Text(
                            'Or continue with',
                            style: TextStyle(color: Colors.grey),
                          ),
                        ),
                        const SizedBox(height: 20),
                        OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            minimumSize: const Size(double.infinity, 50),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(32),
                            ),
                          ),
                          onPressed: () {
                            // ! to replace later with Google sign in
                            print('Sign in with Google');
                          },
                          icon: Image.asset(
                            'assets/google.png',
                            height: 24,
                          ),
                          label: const Text(
                            'Sign in with Google',
                            style: TextStyle(
                              color: Colors.black,
                              fontSize: 16,
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              "Don't have an account?   ",
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
