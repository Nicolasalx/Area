import 'package:flutter/material.dart';

class NewAreaPage extends StatefulWidget {
  const NewAreaPage({super.key});

  @override
  State<NewAreaPage> createState() => _NewAreaPageState();
}

class _NewAreaPageState extends State<NewAreaPage> {
  int currentPage = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: Text("neArea"));
  }
}
