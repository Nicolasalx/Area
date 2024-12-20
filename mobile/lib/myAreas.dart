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
