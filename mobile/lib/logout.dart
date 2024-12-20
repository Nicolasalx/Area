import 'package:area/main.dart';
import 'package:flutter/material.dart';
import 'globals.dart' as globals;

class Auth {
  static void logout(BuildContext context) {
    Navigator.pop(context);
    globals.storage.delete(key: 'name');
    globals.storage.delete(key: 'email');
    globals.storage.delete(key: 'token');
    globals.isLoggedIn = false;
    globals.navigatorKey.currentState!.popUntil(ModalRoute.withName(routeHome));
    globals.navigatorKey.currentState!.pushNamed(routeHome);
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
                        Auth.logout(context);
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
