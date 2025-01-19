import 'package:area/main.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'confirmation.dart' as confirmation;
import 'globals.dart' as globals;
import 'package:http/http.dart' as http;
import 'services_configuration.dart';

const routeProfile = "profile";
const routeSettings = "Settings";
const routeServicesConfig = "ServicesConfiguration";

Future<int> deleteAccount() async {
  try {
    final id = await globals.storage.read(key: "id");
    final token = await globals.storage.read(key: "token");
    final server = await globals.storage.read(key: 'server');
    final response = await http.delete(
      Uri.parse('http://$server/users/$id'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    return response.statusCode;
  } catch (error) {
    return 400;
  }
}

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class ProfileButton extends StatelessWidget {
  final Text text;
  final String path;
  final Icon icon;
  final Function fun;

  const ProfileButton({
    super.key,
    required this.text,
    required this.path,
    required this.icon,
    required this.fun,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color.fromARGB(255, 255, 255, 255),
          border: Border.all(
            color: const Color.fromARGB(255, 185, 185, 185),
          ),
        ),
        child: MaterialButton(
          onPressed: () {
            fun();
          },
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              icon,
              text,
            ],
          ),
        ),
      ),
    );
  }
}

class ProfilePageHome extends StatelessWidget {
  final Function(String newPath) callback;

  ProfilePageHome({super.key, required this.callback});

  final name = globals.storage.read(key: 'name');
  final email = globals.storage.read(key: 'email');

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Padding(
            padding: EdgeInsets.only(
              top: 40,
            ),
            child: Card(
              elevation: 6,
              child: Padding(
                padding: const EdgeInsets.all(
                  50,
                ),
                child: Column(
                  children: [
                    FutureBuilder<bool>(
                      future: globals.storage.containsKey(key: "picture"),
                      builder: (context, snapshot) {
                        if (snapshot.hasData && snapshot.data!) {
                          return FutureBuilder(
                            future: globals.storage.read(
                              key: "picture",
                            ),
                            builder: (context, snapshot) {
                              if (snapshot.hasData) {
                                return ClipRRect(
                                  borderRadius: BorderRadius.circular(45.0),
                                  child: Image.network(
                                    snapshot.data!,
                                  ),
                                );
                              } else {
                                return CircularProgressIndicator();
                              }
                            },
                          );
                        } else {
                          return Icon(
                            Icons.person,
                            size: 50,
                          );
                        }
                      },
                    ),
                    FutureBuilder<String?>(
                      future: name,
                      builder:
                          (BuildContext context, AsyncSnapshot<String?> name) {
                        if (name.hasData) {
                          return Text(
                            "${name.data}",
                            style: TextStyle(
                              fontSize: 15,
                            ),
                          );
                        } else {
                          return CircularProgressIndicator();
                        }
                      },
                    ),
                    FutureBuilder<String?>(
                      future: email,
                      builder:
                          (BuildContext context, AsyncSnapshot<String?> email) {
                        if (email.hasData) {
                          return Text(
                            "${email.data}",
                            style: TextStyle(
                              fontSize: 15,
                            ),
                          );
                        } else {
                          return CircularProgressIndicator();
                        }
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),
          Column(
            children: [
              Row(
                children: [
                  ProfileButton(
                    text: Text(
                      " Services Configuration",
                      style: TextStyle(
                        fontSize: 22,
                      ),
                    ),
                    path: "",
                    icon: Icon(
                      Icons.key,
                      size: 30,
                    ),
                    fun: () {
                      callback(routeServicesConfig);
                    },
                  ),
                ],
              ),
              Row(
                children: [
                  ProfileButton(
                    text: Text(
                      " Settings",
                      style: TextStyle(
                        fontSize: 22,
                      ),
                    ),
                    path: "",
                    icon: Icon(
                      Icons.settings,
                      size: 30,
                    ),
                    fun: () {
                      callback(routeSettings);
                    },
                  ),
                ],
              ),
              Row(
                children: [
                  ProfileButton(
                    text: Text(
                      " Sign out",
                      style: TextStyle(
                        fontSize: 22,
                        color: Colors.red,
                      ),
                    ),
                    path: "",
                    icon: Icon(
                      Icons.logout,
                      color: Colors.red,
                      size: 30,
                    ),
                    fun: () {
                      Navigator.pop(context);
                      globals.storage.delete(key: 'name');
                      globals.storage.delete(key: 'email');
                      globals.storage.delete(key: 'token');
                      globals.isLoggedIn = false;
                      globals.navigatorKey.currentState!
                          .popUntil(ModalRoute.withName(routeHome));
                      globals.navigatorKey.currentState!.pushNamed(routeHome);
                    },
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class ProfilePageSettings extends StatelessWidget {
  final Function callback;
  const ProfilePageSettings({super.key, required this.callback});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Row(
            children: [
              ProfileButton(
                text: Text(
                  " Delete Account",
                  style: TextStyle(
                    fontSize: 22,
                    color: Colors.red,
                  ),
                ),
                path: "",
                icon: Icon(
                  Icons.delete,
                  size: 30,
                  color: Colors.red,
                ),
                fun: () {
                  confirmation.askedDelete(
                    context,
                    "Are you sure you want to delete your account ?",
                    () {
                      final delete = deleteAccount();
                      delete.then((onValue) {
                        switch (onValue) {
                          case 200:
                            globals.storage.delete(key: 'name');
                            globals.storage.delete(key: 'email');
                            globals.storage.delete(key: 'token');
                            globals.isLoggedIn = false;
                            globals.navigatorKey.currentState!
                                .popUntil(ModalRoute.withName(routeHome));
                            globals.navigatorKey.currentState!
                                .pushNamed(routeHome);
                            break;
                          case 401:
                            Fluttertoast.showToast(
                              msg: "Invalid or missing authentication token",
                              toastLength: Toast.LENGTH_SHORT,
                              gravity: ToastGravity.BOTTOM,
                              timeInSecForIosWeb: 1,
                              textColor: Colors.white,
                              backgroundColor: Colors.red,
                              fontSize: 18.0,
                            );
                            break;
                          case 404:
                            Fluttertoast.showToast(
                              msg: "User not found",
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
                              msg: "Server not found",
                              toastLength: Toast.LENGTH_SHORT,
                              gravity: ToastGravity.BOTTOM,
                              timeInSecForIosWeb: 1,
                              textColor: Colors.white,
                              backgroundColor: Colors.red,
                              fontSize: 18.0,
                            );
                            break;
                        }
                      });
                    },
                  );
                },
              ),
            ],
          ),
          Row(
            children: [
              ProfileButton(
                text: Text(
                  " Back",
                  style: TextStyle(
                    fontSize: 22,
                    color: Colors.black,
                  ),
                ),
                path: "",
                icon: Icon(
                  Icons.arrow_back,
                  size: 30,
                  color: Colors.black,
                ),
                fun: () {
                  callback(routeProfile);
                },
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ProfilePageState extends State<ProfilePage> {
  String path = routeProfile;

  void setPath(String newPath) {
    path = newPath;
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return switch (path) {
      routeProfile => ProfilePageHome(
          callback: setPath,
        ),
      routeSettings => ProfilePageSettings(
          callback: setPath,
        ),
      routeServicesConfig => ServicesConfigurationPage(
          callback: setPath,
        ),
      _ => throw StateError('Unexpected route name: $path!'),
    };
  }
}
