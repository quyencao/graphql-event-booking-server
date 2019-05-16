const authGuard = next => (parent, args, context, info) => {
  if (!context.currentUser) {
    throw new Error("Unauthorize!");
  }

  return next(parent, args, context, info);
};

export default authGuard;
