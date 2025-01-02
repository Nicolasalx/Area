class WorkflowTriggerResponse {
  WorkflowTriggerResponse({required this.reaction});
  final String reaction;

  factory WorkflowTriggerResponse.fromJson(Map<String, dynamic> data) {
    return WorkflowTriggerResponse(reaction: data['reaction']);
  }
}

class WorkflowDataResponse {
  WorkflowDataResponse({
    required this.date,
    required this.hour,
  });
  final String date;
  final String hour;

  factory WorkflowDataResponse.fromJson(Map<String, dynamic> data) {
    return WorkflowDataResponse(
      date: data['date'],
      hour: data['hour'],
    );
  }
}

class ServiceResponse {
  ServiceResponse({
    required this.id,
    required this.name,
    required this.description,
  });
  final int id;
  final String name;
  final String description;

  factory ServiceResponse.fromJson(Map<String, dynamic> data) {
    return ServiceResponse(
      id: data['id'],
      name: data['name'],
      description: data['description'],
    );
  }
}

class ActionsResponse {
  ActionsResponse({
    required this.id,
    required this.name,
    required this.description,
    required this.data,
    required this.isActive,
    required this.serviceId,
    required this.workflowId,
    required this.service,
  });
  final String id;
  final String name;
  final String description;
  final WorkflowDataResponse data;
  final bool isActive;
  final int serviceId;
  final String workflowId;
  final ServiceResponse service;

  factory ActionsResponse.fromJson(Map<String, dynamic> dataJson) {
    return ActionsResponse(
      id: dataJson['id'],
      name: dataJson['name'],
      description: dataJson['description'],
      data: WorkflowDataResponse.fromJson(dataJson['data']),
      isActive: dataJson['isActive'],
      serviceId: dataJson['serviceId'],
      workflowId: dataJson['workflowId'],
      service: ServiceResponse.fromJson(dataJson['service']),
    );
  }
}

class WorkflowMessageDataResponse {
  WorkflowMessageDataResponse({
    required this.message,
  });
  final String message;

  factory WorkflowMessageDataResponse.fromJson(Map<String, dynamic> data) {
    return WorkflowMessageDataResponse(
      message: data['message'],
    );
  }
}

class ReactionsResponse {
  ReactionsResponse({
    required this.id,
    required this.name,
    required this.description,
    required this.trigger,
    required this.isActive,
    required this.serviceId,
    required this.workflowId,
    required this.service,
    required this.data,
  });
  final String id;
  final String name;
  final String description;
  final WorkflowTriggerResponse trigger;
  final bool isActive;
  final int serviceId;
  final String workflowId;
  final ServiceResponse service;
  final WorkflowMessageDataResponse data;

  factory ReactionsResponse.fromJson(Map<String, dynamic> data) {
    return ReactionsResponse(
      id: data['id'],
      name: data['name'],
      description: data['description'],
      trigger: WorkflowTriggerResponse.fromJson(data['trigger']),
      data: WorkflowMessageDataResponse.fromJson(data['data']),
      isActive: data['isActive'],
      serviceId: data['serviceId'],
      workflowId: data['workflowId'],
      service: ServiceResponse.fromJson(data['service']),
    );
  }
}

class WorkflowUserResponse {
  WorkflowUserResponse(
      {required this.id,
      required this.name,
      required this.email,
      required this.password,
      // required this.picture,
      required this.isActive,
      required this.createdAt,
      required this.type});
  final String id;
  final String name;
  final String email;
  final String password;
  // final String picture;
  final bool isActive;
  final String createdAt;
  final String type;

  factory WorkflowUserResponse.fromJson(Map<String, dynamic> data) {
    return WorkflowUserResponse(
        id: data['id'],
        name: data['name'],
        email: data['email'],
        password: data['password'],
        // picture: data['picture'] != "null" ? data['picture'] : "",
        isActive: data['isActive'],
        createdAt: data['createdAt'],
        type: data['type']);
  }
}

class WorkflowResponse {
  WorkflowResponse(
      {required this.id,
      required this.name,
      required this.usersId,
      required this.isActive,
      required this.activeActions,
      required this.activeReactions,
      required this.users});
  final String id;
  final String name;
  final String usersId;
  final bool isActive;
  final List<ActionsResponse> activeActions;
  final List<ReactionsResponse> activeReactions;
  final WorkflowUserResponse users;

  factory WorkflowResponse.fromJson(Map<String, dynamic> data) {
    final actionsList = data['activeActions'] as List<dynamic>?;
    final reactionsList = data['activeReactions'] as List<dynamic>?;
    return WorkflowResponse(
      id: data['id'],
      name: data['name'],
      usersId: data['usersId'],
      isActive: data['isActive'],
      activeActions: actionsList != null
          ? actionsList
              .map((action) =>
                  ActionsResponse.fromJson(action as Map<String, dynamic>))
              .toList()
          : <ActionsResponse>[],
      activeReactions: reactionsList != null
          ? reactionsList
              .map((reaction) =>
                  ReactionsResponse.fromJson(reaction as Map<String, dynamic>))
              .toList()
          : <ReactionsResponse>[],
      users: WorkflowUserResponse.fromJson(data['Users']),
    );
  }
}

class JsonWorkflowResponse {
  JsonWorkflowResponse({required this.message, required this.data});
  final String message;
  final List<WorkflowResponse> data;

  factory JsonWorkflowResponse.fromJson(Map<String, dynamic> data) {
    final workflowList = data['data'] as List<dynamic>?;
    return JsonWorkflowResponse(
      message: data['message'],
      data: workflowList != null
          ? workflowList
              .map((reaction) =>
                  WorkflowResponse.fromJson(reaction as Map<String, dynamic>))
              .toList()
          : <WorkflowResponse>[],
    );
  }
}
