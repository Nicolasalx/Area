import 'dart:convert';

import 'package:area/workflow.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'globals.dart' as globals;
import 'string_extension.dart';

class AreaActions {
  static Future<bool> setActive(bool newState, String workflowId) async {
    try {
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
      if (response.statusCode != 200) {
        return false;
      }
      return true;
    } catch (error) {
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
      if (response.statusCode != 200) {
        return false;
      }
      return true;
    } catch (error) {
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
              style: TextStyle(
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
      return Container(
        padding: const EdgeInsets.only(left: 10, right: 10, top: 5, bottom: 5),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          color: Colors.grey[200],
        ),
        child: Text(
          action.name.format(),
          style: const TextStyle(
            fontSize: 20,
          ),
        ),
      );
    }).toList();

    List<Widget> reactions = item.activeReactions.map((reaction) {
      return Container(
        padding: const EdgeInsets.only(left: 10, right: 10, top: 5, bottom: 5),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          color: Colors.grey[200],
        ),
        child: Text(
          reaction.name.format(),
          style: const TextStyle(
            fontSize: 20,
          ),
        ),
      );
    }).toList();

    return Padding(
      padding: const EdgeInsets.only(top: 20, right: 20),
      child: Card(
        color: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8.0),
        ),
        elevation: 6,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Row(
                children: <Widget>[
                  Expanded(
                    flex: 8,
                    child: Text(
                      item.name.format(),
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 23,
                      ),
                    ),
                  ),
                  const Spacer(),
                  MaterialButton(
                    minWidth: 20,
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
                    minWidth: 20,
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
              const Row(
                children: [
                  Icon(Icons.play_circle_outlined),
                  Text(
                    " Actions",
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 20,
                    ),
                  ),
                ],
              ),
              Padding(
                padding: const EdgeInsets.only(left: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: actions,
                ),
              ),
              const Row(
                children: [
                  Icon(Icons.arrow_forward),
                  Text(
                    " Reactions",
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 20,
                    ),
                  ),
                ],
              ),
              Padding(
                padding: const EdgeInsets.only(left: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: reactions,
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

class NoAreaFound extends StatelessWidget {
  const NoAreaFound({super.key});

  @override
  Widget build(BuildContext context) {
    return const Text("No areas found",
        style: TextStyle(fontWeight: FontWeight.w700, fontSize: 25));
  }
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
                    if (widgets.hasData && widgets.data!.isNotEmpty) {
                      return Column(children: widgets.data!);
                    } else {
                      return const NoAreaFound();
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
