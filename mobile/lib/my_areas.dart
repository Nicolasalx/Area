import 'dart:convert';

import 'package:area/workflow.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'globals.dart' as globals;

Future<List<Widget>> getWorkflow() async {
  var response = await http.get(
    Uri.parse(
        '${dotenv.env['FLUTTER_PUBLIC_BACKEND_URL']}/workflow/${globals.storage.read(key: "token")}'),
    headers: {
      'Content-Type': 'application/json',
    },
  );
  JsonWorkflowResponse workflow =
      JsonWorkflowResponse.fromJson(json.decode(response.body));

  List<Widget> widgets = workflow.data.map((item) {
    return Padding(
      padding: const EdgeInsets.only(top: 20),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(5),
          color: const Color.fromARGB(255, 255, 255, 255),
          border: Border.all(
            color: const Color.fromARGB(255, 185, 185, 185),
          ),
        ),
        child: Text(
          item.id,
          style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 25),
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.only(top: 20.0, left: 20),
          child: Column(
            children: [
              const Text(
                "My Areas",
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 25),
              ),
              Padding(
                padding: const EdgeInsets.only(top: 20.0),
                child: FutureBuilder(
                  future: getWorkflow(),
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
