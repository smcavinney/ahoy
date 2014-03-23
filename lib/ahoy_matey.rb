require "addressable/uri"
require "browser"
require "geocoder"
require "referer-parser"
require "request_store"
require "ahoy/version"
require "ahoy/controller"
require "ahoy/model"
require "ahoy/engine"

module Ahoy

  def self.ahoy_visit_model
    ::AhoyVisit
  end

  # TODO private
  # performance hack for referer-parser
  def self.referrer_parser
    @referrer_parser ||= RefererParser::Referer.new("https://github.com/ankane/ahoy")
  end

end

ActionController::Base.send :include, Ahoy::Controller
ActiveRecord::Base.send(:extend, Ahoy::Model) if defined?(ActiveRecord)

if defined?(Warden)
  Warden::Manager.after_authentication do |user, auth, opts|
    request = Rack::Request.new(auth.env)
    if request.cookies["ahoy_visit"]
      visit = Ahoy.ahoy_visit_model.where(ahoy_visit_token: request.cookies["ahoy_ahoy_visit"]).first
      if ahoy_visit
        ahoy_visit.user = user
        ahoy_visit.save!
      end
    end
  end
end
