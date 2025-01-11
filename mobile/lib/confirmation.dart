import 'package:flutter/material.dart';

Future<void> askedDelete(
  BuildContext context,
  String confirmationText,
  Function onPressed,
) async {
  await showDialog(
    context: context,
    builder: (BuildContext context) {
      return SimpleDialog(
        title: Text(
          confirmationText,
          style: TextStyle(
            fontWeight: FontWeight.w700,
            fontSize: 20,
          ),
        ),
        children: <Widget>[
          Row(
            children: [
              Padding(
                padding: const EdgeInsets.only(top: 10, right: 25, bottom: 10),
                child: SimpleDialogOption(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: const Text(
                    'No',
                    style: TextStyle(
                      fontSize: 20,
                    ),
                  ),
                ),
              ),
              const Spacer(),
              Padding(
                padding: const EdgeInsets.only(top: 10, left: 25, bottom: 10),
                child: SimpleDialogOption(
                  onPressed: () {
                    onPressed();
                    Navigator.pop(context);
                  },
                  child: const Text(
                    'Yes',
                    style: TextStyle(
                      color: Colors.red,
                      fontSize: 20,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      );
    },
  );
}
