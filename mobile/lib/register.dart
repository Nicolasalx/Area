import 'package:area/login.dart';
import 'package:flutter/material.dart';
import 'package:form_field_validator/form_field_validator.dart';

class LabelText extends StatelessWidget {
  final String text;

  const LabelText({
    super.key,
    required this.text,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 0, bottom: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            text,
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 15,
            ),
            textAlign: TextAlign.start,
          ),
        ],
      ),
    );
  }
}

class FormInput extends StatelessWidget {
  final TextEditingController controller;
  final String hintText;
  final IconData icon;
  final String? Function(String?)? validator;
  final bool attemptedSubmit = false;

  const FormInput({
    super.key,
    required this.controller,
    required this.hintText,
    required this.icon,
    this.validator,
    attemptedSubmit,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: TextFormField(
        controller: controller,
        validator: validator,
        autovalidateMode: attemptedSubmit
            ? AutovalidateMode.onUserInteraction
            : AutovalidateMode.disabled,
        decoration: InputDecoration(
          hintText: hintText,
          prefixIcon: Icon(
            icon,
            color: Colors.grey,
          ),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
    );
  }
}

class PasswordInput extends StatelessWidget {
  final TextEditingController controller;
  final bool obscure;
  final VoidCallback onToggle;
  final String? Function(String?)? validator;
  final bool attemptedSubmit = false;

  const PasswordInput({
    super.key,
    required this.controller,
    required this.obscure,
    required this.onToggle,
    this.validator,
    attemptedSubmit,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: TextFormField(
        controller: controller,
        obscureText: obscure,
        validator: validator,
        autovalidateMode: attemptedSubmit
            ? AutovalidateMode.onUserInteraction
            : AutovalidateMode.disabled,
        decoration: InputDecoration(
          hintText: 'Enter your password',
          prefixIcon: const Icon(
            Icons.lock_outline,
            color: Colors.grey,
          ),
          suffixIcon: IconButton(
            icon: Icon(
              obscure ? Icons.visibility_off : Icons.visibility,
              color: Colors.grey,
            ),
            onPressed: onToggle,
          ),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
    );
  }
}

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final formkey = GlobalKey<FormState>();
  final email = TextEditingController();
  final passwd = TextEditingController();
  final confirmPasswd = TextEditingController();
  final name = TextEditingController();
  bool _passwordObscure = true;
  bool _confirmPasswordObscure = true;
  bool _attemptedSubmit = false;

  void _togglePassword() {
    setState(() {
      _passwordObscure = !_passwordObscure;
    });
  }

  void _toggleConfirmPassword() {
    setState(() {
      _confirmPasswordObscure = !_confirmPasswordObscure;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            Padding(
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
                        'Create Account',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 30,
                        ),
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.only(top: 5.0),
                      child: Text(
                        'Sign up for a new account',
                        style: TextStyle(
                          fontSize: 15,
                          color: Color.fromARGB(255, 119, 119, 119),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Form(
                        key: formkey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            const LabelText(text: 'Name'),
                            FormInput(
                              controller: name,
                              hintText: 'Enter your name',
                              icon: Icons.person_outline,
                              validator: RequiredValidator(
                                      errorText: 'Name is required')
                                  .call,
                              attemptedSubmit: _attemptedSubmit,
                            ),
                            const LabelText(text: 'Email'),
                            FormInput(
                              controller: email,
                              hintText: 'Enter your email',
                              icon: Icons.alternate_email,
                              validator: MultiValidator([
                                RequiredValidator(
                                    errorText: 'Email is required'),
                                EmailValidator(
                                    errorText: 'Invalid email address'),
                              ]).call,
                              attemptedSubmit: _attemptedSubmit,
                            ),
                            const LabelText(text: 'Password'),
                            PasswordInput(
                              controller: passwd,
                              obscure: _passwordObscure,
                              onToggle: _togglePassword,
                              validator: MultiValidator([
                                RequiredValidator(
                                    errorText: 'Password is required'),
                                MinLengthValidator(8,
                                    errorText:
                                        'Password must be at least 8 characters'),
                              ]).call,
                              attemptedSubmit: _attemptedSubmit,
                            ),
                            const LabelText(text: 'Confirm Password'),
                            PasswordInput(
                              controller: confirmPasswd,
                              obscure: _confirmPasswordObscure,
                              onToggle: _toggleConfirmPassword,
                              validator: (val) {
                                if (val != passwd.text) {
                                  return 'Passwords do not match';
                                }
                                return null;
                              },
                              attemptedSubmit: _attemptedSubmit,
                            ),
                            SizedBox(
                              height: 10,
                            ),
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
                                  setState(() {
                                    _attemptedSubmit = true;
                                  });
                                  if (formkey.currentState!.validate()) {
                                    Auth.register(
                                      email.text,
                                      passwd.text,
                                      name.text,
                                      context,
                                    );
                                  }
                                },
                                child: const Text(
                                  'Create Account',
                                  style: TextStyle(
                                    fontSize: 18,
                                    color: Colors.white,
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
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Already have an account?   ',
                    style: TextStyle(color: Colors.grey),
                  ),
                  GestureDetector(
                    onTap: () {
                      Navigator.pushReplacementNamed(context, '/login');
                    },
                    child: const Text(
                      'Sign in',
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
