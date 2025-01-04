import 'dart:convert';

import 'package:area/workflow.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'globals.dart' as globals;

class AreaActions {
  static Future<bool> setActive(bool newState, String workflowId) async {
    try {
      print("new state: $newState");
      var token = await globals.storage.read(key: "token");
      final response = await http.patch(
        Uri.parse(
            '${dotenv.env['FLUTTER_PUBLIC_BACKEND_URL']}/workflow/$workflowId/toggle'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({'isActive': newState}),
      );
      print(response.body);
      return true;
    } catch (error) {
      print("Unable to communicate with the server");
      return false;
    }
  }

  static Future<bool> deleteArea(String workflowId) async {
    try {
      var token = await globals.storage.read(key: "token");
      final response = await http.delete(
        Uri.parse(
            '${dotenv.env['FLUTTER_PUBLIC_BACKEND_URL']}/workflow/$workflowId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      print(response.body);
      return true;
    } catch (error) {
      print("Unable to communicate with the server");
      return false;
    }
  }

  static Future<void> _askedDelete(
    BuildContext context,
    String workflowId,
    Function? callback,
  ) async {
    await showDialog(
        context: context,
        builder: (BuildContext context) {
          return SimpleDialog(
            title: const Text(
              'Are you sure you want to delete this area ?',
              style: const TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 20,
              ),
            ),
            children: <Widget>[
              Row(
                children: [
                  Padding(
                    padding:
                        const EdgeInsets.only(top: 10, left: 25, bottom: 10),
                    child: SimpleDialogOption(
                      onPressed: () {
                        final deleted = AreaActions.deleteArea(workflowId);
                        deleted.then(
                          (onValue) {
                            if (onValue) {
                              callback!();
                            }
                          },
                        );
                        Navigator.pop(context);
                      },
                      child: const Text(
                        'Yes',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 20,
                        ),
                      ),
                    ),
                  ),
                  const Spacer(),
                  Padding(
                    padding:
                        const EdgeInsets.only(top: 10, right: 25, bottom: 10),
                    child: SimpleDialogOption(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      child: const Text(
                        'No',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 20,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          );
        });
  }
}

Future<List<Widget>> getWorkflow(
    Function? callback, BuildContext context) async {
  var id = await globals.storage.read(key: "id");
  var token = await globals.storage.read(key: "token");
  var response = await http.get(
    Uri.parse('${dotenv.env['FLUTTER_PUBLIC_BACKEND_URL']}/workflow/$id'),
    headers: {
      'Authorization': 'Bearer $token',
    },
  );
  JsonWorkflowResponse workflow =
      JsonWorkflowResponse.fromJson(json.decode(response.body));
  List<Widget> widgets = workflow.data.map((item) {
    List<Widget> actions = item.activeActions.map((action) {
      return Text(
        action.name,
        style: const TextStyle(
          fontWeight: FontWeight.w700,
          fontSize: 20,
        ),
      );
    }).toList();

    List<Widget> reactions = item.activeReactions.map((reaction) {
      return Text(
        reaction.name,
        style: const TextStyle(
          fontWeight: FontWeight.w700,
          fontSize: 20,
        ),
      );
    }).toList();

    return Padding(
      padding: const EdgeInsets.only(top: 20, right: 20),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(5),
          color: const Color.fromARGB(255, 255, 255, 255),
          border: Border.all(
            color: const Color.fromARGB(255, 185, 185, 185),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Row(
                children: <Widget>[
                  Text(
                    item.name,
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 23,
                    ),
                  ),
                  const Spacer(),
                  MaterialButton(
                    minWidth: 40,
                    child: Icon(
                      Icons.power_settings_new,
                      color: item.isActive ? Colors.green : Colors.black,
                    ),
                    onPressed: () {
                      final newStatus =
                          AreaActions.setActive(!item.isActive, item.id);
                      newStatus.then(
                        (onValue) {
                          if (onValue) {
                            callback!();
                          }
                        },
                      );
                    },
                  ),
                  MaterialButton(
                    minWidth: 40,
                    child: const Icon(
                      Icons.delete,
                      color: Colors.grey,
                    ),
                    onPressed: () {
                      AreaActions._askedDelete(context, item.id, callback);
                    },
                  ),
                ],
              ),
              const Text(
                "Actions",
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 20,
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(left: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: actions,
                ),
              ),
              const Text(
                "Reactions",
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 20,
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(left: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: reactions,
                ),
              ),
              Text(
                item.isActive ? "Active" : "Not active",
                style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 23,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }).toList();

  return widgets;
}

class MyAreasPage extends StatefulWidget {
  const MyAreasPage({super.key});

  @override
  State<MyAreasPage> createState() => _MyAreasPageState();
}

class _MyAreasPageState extends State<MyAreasPage> {
  int currentPage = 0;

  void rechargePage() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.only(top: 20.0, left: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "My Areas",
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 25),
              ),
              Padding(
                padding: const EdgeInsets.only(top: 20.0),
                child: FutureBuilder(
                  future: getWorkflow(rechargePage, context),
                  builder: (BuildContext context,
                      AsyncSnapshot<List<Widget>> widgets) {
                    if (widgets.hasData) {
                      print(widgets.data!.length);
                      return Column(children: widgets.data!);
                    } else {
                      return const Column();
                    }
                  },
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
import 'package:flutter/material.dart';

class MyAreasPage extends StatefulWidget {
  const MyAreasPage({super.key});

  @override
  State<MyAreasPage> createState() => _MyAreasPageState();
}

class _MyAreasPageState extends State<MyAreasPage> {
  int currentPage = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: Text("myArea"));
  }
}
