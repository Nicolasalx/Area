import 'dart:convert';
import 'package:area/main.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'globals.dart' as globals;

class Auth {
  static Future<void> login(String email, String passwd) async {
    try {
      final response = await http.post(
        Uri.parse('${dotenv.env['FLUTTER_PUBLIC_BACKEND_URL']}/auth/login'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode({'email': email, 'password': passwd}),
      );

      if (response.statusCode == 200) {
        print("Connected");
        print(response.body);
      }
    } catch (error) {
      return;
    }
  }
}

class LogoutPage extends StatefulWidget {
  const LogoutPage({super.key});

  @override
  State<LogoutPage> createState() => _LogoutPageState();
}

class _LogoutPageState extends State<LogoutPage> {
  final name = globals.storage.read(key: 'name');
  @override
  Widget build(BuildContext context) {
    final formkey = GlobalKey<FormState>();
    final email = TextEditingController();
    final passwd = TextEditingController();

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
                Padding(
                  padding: const EdgeInsets.only(top: 20.0),
                  child: Center(
                    child: FutureBuilder<String?>(
                        future: name,
                        builder: (BuildContext context,
                            AsyncSnapshot<String?> snapshot) {
                          if (snapshot.hasData) {
                            return Text(
                              'Now connected as ${snapshot.data}',
                              style: const TextStyle(
                                fontSize: 15,
                                color: Color.fromARGB(255, 119, 119, 119),
                              ),
                            );
                          } else {
                            return const Text('Error');
                          }
                        }),
                  ),
                ),
                Padding(
                    padding: const EdgeInsets.only(top: 20, bottom: 20),
                    child: ElevatedButton(
                      style: ButtonStyle(
                        backgroundColor: WidgetStateProperty.all(Colors.green),
                        padding: WidgetStateProperty.all(
                          const EdgeInsets.all(20),
                        ),
                        textStyle: WidgetStateProperty.all(
                          const TextStyle(fontSize: 14, color: Colors.white),
                        ),
                      ),
                      onPressed: () {
                        Navigator.pop(context);
                        globals.storage.delete(key: 'name');
                        globals.storage.delete(key: 'email');
                        globals.storage.delete(key: 'token');
                        print(globals.navigatorKey);
                        globals.navigatorKey.currentState!
                            .popUntil(ModalRoute.withName(routeHome));
                        globals.navigatorKey.currentState!
                            .pushNamed(routeLogin);
                      },
                      child: const Text(
                        'Sign out',
                        style: TextStyle(color: Colors.white, fontSize: 22),
                      ),
                    ))
              ],
            ),
          ),
        ),
      ),
    );
  }
}
