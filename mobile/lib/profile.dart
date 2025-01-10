import 'package:flutter/material.dart';
import 'globals.dart' as globals;

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class ProfileButton extends StatelessWidget {
  final Text text;
  final String path;
  final Icon icon;

  const ProfileButton({
    super.key,
    required this.text,
    required this.path,
    required this.icon,
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
            print("han");
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

class _ProfilePageState extends State<ProfilePage> {
  int currentPage = 0;
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
                  ),
                ],
              ),
              // Row(
              //   children: [
              //     ProfileButton(
              //       text: Text(
              //         " Delete Account",
              //         style: TextStyle(
              //           fontSize: 22,
              //           color: Colors.red,
              //         ),
              //       ),
              //       path: "",
              //       icon: Icon(
              //         Icons.delete,
              //         size: 30,
              //         color: Colors.red,
              //       ),
              //     ),
              //   ],
              // ),
            ],
          ),
        ],
      ),
    );
  }
}
