import 'dart:convert';
import 'package:fluttertoast/fluttertoast.dart';

import 'confirmation.dart' as confirmation;
import 'package:area/svg_services.dart';
import 'package:area/workflow.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:http/http.dart' as http;
import 'globals.dart' as globals;
import 'string_extension.dart';

class AreaActions {
  static Future<int> setActive(bool newState, String workflowId) async {
    try {
      final token = await globals.storage.read(key: "token");
      final server = await globals.storage.read(key: 'server');
      final response = await http.patch(
        Uri.parse('http://$server/workflow/$workflowId/toggle'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({'isActive': newState}),
      );
      return response.statusCode;
    } catch (error) {
      return 400;
    }
  }

  static Future<int> deleteArea(String workflowId) async {
    try {
      final token = await globals.storage.read(key: "token");
      final server = await globals.storage.read(key: 'server');
      final response = await http.delete(
        Uri.parse('http://$server/workflow/$workflowId'),
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
}

Future<List<Widget>> getWorkflow(
    Function? callback, BuildContext context) async {
  final id = await globals.storage.read(key: "id");
  final token = await globals.storage.read(key: "token");
  final server = await globals.storage.read(key: 'server');
  final response = await http.get(
    Uri.parse('http://$server/workflow/$id'),
    headers: {
      'Authorization': 'Bearer $token',
    },
  );
  JsonWorkflowResponse workflow =
      JsonWorkflowResponse.fromJson(json.decode(response.body));
  List<Widget> widgets = workflow.data.map((item) {
    List<Widget> actions = item.activeActions.map((action) {
      return Padding(
        padding: const EdgeInsets.only(top: 10),
        child: Container(
          padding: const EdgeInsets.all(10),
          width: double.infinity,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            color: Colors.grey[100],
          ),
          child: Row(
            children: [
              SvgPicture.string(
                getServiceSvg(action.service.name),
                width: 20,
                height: 20,
              ),
              Expanded(
                flex: 8,
                child: Text(
                  " ${action.name.format()}",
                  style: const TextStyle(
                    fontSize: 18,
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }).toList();

    List<Widget> reactions = item.activeReactions.map((reaction) {
      return Padding(
        padding: const EdgeInsets.only(top: 10),
        child: Container(
          padding: const EdgeInsets.all(10),
          width: double.infinity,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            color: Colors.grey[100],
          ),
          child: Row(
            children: [
              SvgPicture.string(
                getServiceSvg(reaction.service.name),
                width: 20,
                height: 20,
              ),
              Expanded(
                flex: 8,
                child: Text(
                  " ${reaction.name.format()}",
                  style: const TextStyle(
                    fontSize: 18,
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }).toList();

    return Padding(
      padding: const EdgeInsets.only(top: 20, right: 20),
      child: Card(
        semanticContainer: true,
        color: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8.0),
        ),
        elevation: 2,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Container(
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(8.0),
                  topRight: Radius.circular(8.0),
                ),
              ),
              width: double.infinity,
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: <Widget>[
                    Expanded(
                      flex: 8,
                      child: Text(
                        item.name.format(),
                        style: const TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 20,
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
                            switch (onValue) {
                              case 200:
                                callback!();
                                break;
                              case 404:
                                Fluttertoast.showToast(
                                  msg: "Workflow not found",
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
                        confirmation.askedDelete(
                          context,
                          'Are you sure you want to delete this area ?',
                          () {
                            final deleted = AreaActions.deleteArea(item.id);
                            deleted.then(
                              (onValue) {
                                switch (onValue) {
                                  case 200:
                                    callback!();
                                    break;
                                  case 404:
                                    Fluttertoast.showToast(
                                      msg: "Workflow not found",
                                      toastLength: Toast.LENGTH_SHORT,
                                      gravity: ToastGravity.BOTTOM,
                                      timeInSecForIosWeb: 1,
                                      textColor: Colors.white,
                                      backgroundColor: Colors.red,
                                      fontSize: 18.0,
                                    );
                                    break;
                                  case 500:
                                    Fluttertoast.showToast(
                                      msg: "Internal server error",
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
                                }
                              },
                            );
                          },
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(left: 20, right: 20, top: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
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
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
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
          ],
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
    return Padding(
      padding: const EdgeInsets.only(
        top: 50,
        right: 20,
      ),
      child: Center(
        child: Card(
          elevation: 5,
          child: Padding(
            padding: const EdgeInsets.only(
              left: 30,
              right: 30,
              top: 50,
              bottom: 50,
            ),
            child: Column(
              children: [
                SvgPicture.string(
                  '''<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ghost"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>''',
                  width: 70,
                  height: 70,
                ),
                const Padding(
                  padding: EdgeInsets.only(top: 20),
                  child: Text(
                    "No areas found",
                    style: TextStyle(fontWeight: FontWeight.w700, fontSize: 25),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 20),
                  child: Text(
                    "Create your first area to get started",
                    style: TextStyle(
                      color: Colors.grey[700],
                      fontSize: 17,
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

class MyAreasPage extends StatefulWidget {
  const MyAreasPage({super.key});

  @override
  State<MyAreasPage> createState() => _MyAreasPageState();
}

class _MyAreasPageState extends State<MyAreasPage> {
  void rechargePage() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.only(
            top: 20.0,
            left: 20,
          ),
          child: FutureBuilder(
            future: getWorkflow(rechargePage, context),
            builder:
                (BuildContext context, AsyncSnapshot<List<Widget>> widgets) {
              if (widgets.hasData && widgets.data!.isNotEmpty) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: widgets.data!,
                );
              } else {
                return const Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    NoAreaFound(),
                  ],
                );
              }
            },
          ),
        ),
      ),
    );
  }
}
