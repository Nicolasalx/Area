import 'dart:convert';
import 'dart:ffi';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter/material.dart';
import 'package:area/main.dart';
import 'package:area/user.dart';
import 'package:http/http.dart' as http;
import '../globals.dart' as globals;

class AuthGithub {
  static Future<bool> login(String code) async {
    try {
      Uri uriBackGithub = Uri.parse('${dotenv.env['FLUTTER_PUBLIC_BACKEND_URL']}/auth/github/callback/?code=$code&redirect_uri=${dotenv.env['GITHUB_REDIRECT_URI']}');
      final response = await http.get(uriBackGithub);

      if (response.statusCode == 200) {
        globals.isLoggedIn = true;
        var responseData = json.decode(response.body);
        await globals.storage
            .write(key: 'token', value: responseData["token"]);
        await globals.storage
            .write(key: 'email', value: responseData["user"]["email"]);
        await globals.storage
            .write(key: 'name', value: responseData["user"]["name"]);
        await globals.storage
            .write(key: 'id', value: responseData["user"]["id"]);
        globals.navigatorKey.currentState!
            .popUntil(ModalRoute.withName(routeHome));
        globals.navigatorKey.currentState!.pushNamed(routeHome);
      }
      return true;
    } catch (error) {
      print(" /!\\ ERROR : Login OAuth Failed");
      print(error);
      return false;
    }
  }
}

var httpUri = Uri(
  scheme: 'https',
  host: 'github.com',
  path: '/login/oauth/authorize',
  queryParameters: {
    'client_id': '${dotenv.env['GITHUB_CLIENT_ID']}',
    'redirect_uri': '${dotenv.env['GITHUB_REDIRECT_URI']}',
    'response_type': 'code',
    'scope': ["read:user", "user:email"].join(" "),
  }
);

class OAuthGithubPage extends StatelessWidget {
  const OAuthGithubPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Flutter Simple Example')),
      body: WebViewWidget(controller: WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0x00000000))
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {},
          onPageFinished: (String url) {},
          onWebResourceError: (WebResourceError error) {},
          onNavigationRequest: (NavigationRequest request) {
            var uri = Uri.parse(dotenv.env['GITHUB_REDIRECT_URI']??"error");
            if (request.url.startsWith(uri.toString())) {
              var requestUri = Uri.parse(request.url);
              AuthGithub.login(requestUri.queryParameters['code'] ?? "");
              return NavigationDecision.prevent;
            }
            return NavigationDecision.navigate;
          },
        ),
      )
      ..setUserAgent("Chrome")
      ..loadRequest(httpUri)
      ),
    );
  }
}


