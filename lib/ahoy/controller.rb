module Ahoy
  module Controller

    def self.included(base)
      base.helper_method :current_ahoy_visit
      base.before_filter do
        RequestStore.store[:ahoy_controller] ||= self
      end
    end

    protected

    def current_ahoy_visit
      if cookies[:ahoy_ahoy_visit]
        @current_visit ||= Ahoy.ahoy_visit_model.where(visit_token: cookies[:ahoy_ahoy_visit]).first
      end
    end

  end
end
