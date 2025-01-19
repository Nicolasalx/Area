import 'package:area/profile.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter/material.dart';
import 'package:area/main.dart';
import 'package:http/http.dart' as http;
import '../globals.dart' as globals;

class AuthTrello {
  static Future<bool> login(String token) async {
    try {
      var userId = await globals.storage.read(key: 'id');
      Uri uriBackTrello = Uri.parse('${dotenv.env['FLUTTER_PUBLIC_BACKEND_URL']}/auth/trello/callback/?token=$token&state=$userId');
      final response = await http.get(uriBackTrello);

      if (response.statusCode == 200) {
        if (userId == null) {
          Fluttertoast.showToast(
            msg: 'Service connected successfully',
            backgroundColor: Colors.green,
          );
          globals.navigatorKey.currentState!
              .popUntil(ModalRoute.withName(routeServicesConfig));
          globals.navigatorKey.currentState!.pushNamed(routeServicesConfig);
        }
      } else {
        Fluttertoast.showToast(
          msg: 'Login failed',
          backgroundColor: Colors.red,
        );
      }
      globals.navigatorKey.currentState!
          .popUntil(ModalRoute.withName(routeHome));
      globals.navigatorKey.currentState!.pushNamed(routeHome);
      return true;
    } catch (error) {
      Fluttertoast.showToast(
        msg: 'Login OAuth failed',
        backgroundColor: Colors.red,
      );
      return false;
    }
  }
}

var httpUri = Uri.parse('https://api.trello.com/1/OAuthAuthorizeToken?&expiration=never&scope=read%2Cwrite&key=${dotenv.env['TRELLO_API_KEY']}&oauth_callback=${dotenv.env['TRELLO_REDIRECT_URI']}');

class OAuthTrelloPage extends StatelessWidget {
  const OAuthTrelloPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Connection Oauth Trello')),
      body: WebViewWidget(controller: WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0x00000000))
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {
            print(url);
          },
          onPageFinished: (String url) {},
          onWebResourceError: (WebResourceError error) {},
          onNavigationRequest: (NavigationRequest request) {
            var uri = Uri.parse(dotenv.env['TRELLO_REDIRECT_URI']??"error");
            if (request.url.startsWith(uri.toString())) {
              var token = request.url.split('=')[1];
              AuthTrello.login(token);
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


