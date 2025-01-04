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
}

Future<List<Widget>> getWorkflow(Function? callback) async {
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
                  future: getWorkflow(rechargePage),
                  builder: (BuildContext context,
                      AsyncSnapshot<List<Widget>> widgets) {
                    if (widgets.hasData) {
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
