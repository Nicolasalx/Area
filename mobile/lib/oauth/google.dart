import 'dart:convert';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter/material.dart';
import 'package:area/main.dart';
import 'package:http/http.dart' as http;
import '../globals.dart' as globals;

class AuthGoogle {
  static Future<bool> login(String code) async {
    try {
      Uri uriBackGoogle = Uri.parse(
          '${dotenv.env['FLUTTER_PUBLIC_BACKEND_URL']}/auth/google/callback/?code=$code&redirect_uri=${dotenv.env['GOOGLE_REDIRECT_URI']}');
      final response = await http.get(uriBackGoogle);

      if (response.statusCode == 200) {
        globals.isLoggedIn = true;
        var responseData = json.decode(response.body);
        await globals.storage.write(key: 'token', value: responseData["token"]);
        await globals.storage
            .write(key: 'email', value: responseData["user"]["email"]);
        await globals.storage
            .write(key: 'name', value: responseData["user"]["name"]);
        await globals.storage
            .write(key: 'id', value: responseData["user"]["id"]);
        await globals.storage
            .write(key: 'picture', value: responseData["user"]["picture"]);
        print(responseData["user"]["picture"]);
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
    host: 'accounts.google.com',
    path: '/o/oauth2/v2/auth',
    queryParameters: {
      'response_type': 'code',
      'prompt': 'select_account',
      'client_id': '${dotenv.env['GOOGLE_CLIENT_ID']}',
      'redirect_uri': '${dotenv.env['GOOGLE_REDIRECT_URI']}',
      'scope': [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://mail.google.com/",
        "https://www.googleapis.com/auth/tasks",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/calendar.events.readonly",
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.apps.readonly",
        "https://www.googleapis.com/auth/youtube",
      ].join(" "),
    });

class OAuthGooglePage extends StatelessWidget {
  const OAuthGooglePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Connection Oauth Google')),
      body: WebViewWidget(
          controller: WebViewController()
            ..setJavaScriptMode(JavaScriptMode.unrestricted)
            ..setBackgroundColor(const Color(0x00000000))
            ..setNavigationDelegate(
              NavigationDelegate(
                onPageStarted: (String url) {},
                onPageFinished: (String url) {},
                onWebResourceError: (WebResourceError error) {},
                onNavigationRequest: (NavigationRequest request) {
                  var uri =
                      Uri.parse(dotenv.env['GOOGLE_REDIRECT_URI'] ?? "error");
                  if (request.url.startsWith(uri.toString())) {
                    var requestUri = Uri.parse(request.url);
                    AuthGoogle.login(requestUri.queryParameters['code'] ?? "");
                    return NavigationDecision.prevent;
                  }
                  return NavigationDecision.navigate;
                },
              ),
            )
            ..setUserAgent("Chrome")
            ..loadRequest(httpUri)),
    );
  }
}
