import 'package:area/login.dart';
import 'package:area/logout.dart';
import 'package:area/nav_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'globals.dart' as globals;

const routeHome = '/';
const routeLogin = '/login';
const routeLogout = '/logout';
const routeMain = '/main';

Future<void> main() async {
  await dotenv.load(fileName: "lib/.env");
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        fontFamily: 'Regular',
        scaffoldBackgroundColor: const Color.fromARGB(255, 243, 244, 246),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'AREA'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color.fromARGB(255, 255, 255, 255),
        title: Text(
          widget.title,
          style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 30),
        ),
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            const DrawerHeader(
              decoration: BoxDecoration(
                color: Colors.blue,
              ),
              child: Text('Drawer Header'),
            ),
            ListTile(
              title: const Text('Item 1'),
              onTap: () {
                Navigator.pop(context);
              },
            ),
            ListTile(
              title: const Text('Item 2'),
              onTap: () {
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
      body: Navigator(
        key: globals.navigatorKey,
        onGenerateRoute: _onGenerateRoute,
      ),
    );
  }
}

Route<Widget> _onGenerateRoute(RouteSettings settings) {
  final page = switch (settings.name) {
    routeHome => globals.isLoggedIn ? const NavBarPage() : const LoginPage(),
    routeLogin => const LoginPage(),
    routeLogout => const LogoutPage(),
    routeMain => const NavBarPage(),
    _ => throw StateError('Unexpected route name: ${settings.name}!')
  };
  return MaterialPageRoute(
    builder: (context) {
      return page;
    },
    settings: settings,
  );
}
