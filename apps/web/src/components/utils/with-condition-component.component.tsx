import { useAuthUser } from "@/hooks/auth.hook";

function withConditionComponent<T extends object>(
  Component: React.ComponentType<T>,
  condition: boolean,
  FallbackComponent: React.ComponentType = () => null
) {
  return (props: T) => {
    if (condition) {
      return <Component {...(props as T & JSX.IntrinsicAttributes)} />;
    } else {
      return <FallbackComponent />;
    }
  };
}

export function withEmailNotVerifiedComponent(
  Component: React.ComponentType,
  FallbackComponent: React.ComponentType = () => null
) {
  return function WrappedComponent(props: any) {
    const { authUser } = useAuthUser();

    const ConditionedComponent = withConditionComponent(
      Component,
      !authUser?.is_email_verified,
      FallbackComponent
    );

    return <ConditionedComponent {...props} />;
  };
}

export function withProfileCompleteComponent(
  Component: React.ComponentType,
  FallbackComponent: React.ComponentType = () => null
) {
  return function WrappedComponent(props: any) {
    const { authUser } = useAuthUser();

    const isProfileComplete = authUser?.is_profile_complete ?? false;

    const ConditionedComponent = withConditionComponent(
      Component,
      isProfileComplete,
      FallbackComponent
    );

    return <ConditionedComponent {...props} />;
  };
}
