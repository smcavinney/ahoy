Rails.application.routes.draw do
  mount Ahoy::Engine => "/ahoy"
end

Ahoy::Engine.routes.draw do
  resources :ahoy_visits, only: [:create]
end
